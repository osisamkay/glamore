import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request) {
  try {
    const topCategories = await prisma.orderItem.groupBy({
      by: ['productCategory'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const formattedCategories = topCategories.map(category => ({
      name: category.productCategory,
      sales: category._sum.quantity,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching top categories:', error);
    return NextResponse.json({ error: 'Failed to fetch top categories' }, { status: 500 });
  }
}
