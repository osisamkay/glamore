import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status');
  const sortBy = searchParams.get('sortBy') || 'date_desc';
  const type = searchParams.get('type') || 'regular';

  const [sortField, sortOrder] = sortBy.split('_');

  const whereClause = {
    AND: [],
  };

  if (search) {
    whereClause.AND.push({
      OR: [
        { id: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (status && status !== 'Any Status') {
    whereClause.AND.push({ status: status });
  }

  if (type === 'tailored') {
    whereClause.AND.push({
      items: {
        some: {
          customMeasurements: { not: null },
        },
      },
    });
  } else {
    whereClause.AND.push({
      items: {
        every: {
          customMeasurements: null,
        },
      },
    });
  }

  try {
    const orders = await prisma.order.findMany({
      where: whereClause.AND.length > 0 ? whereClause : undefined,
      include: {
        items: true
      },
      orderBy: {
        [sortField === 'date' ? 'createdAt' : 'total']: sortOrder,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
