import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request) {
  try {
    const returnRequests = await prisma.returnRequest.findMany({
      include: {
        items: {
          include: {
            orderItem: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });

    return NextResponse.json(returnRequests);
  } catch (error) {
    console.error('Failed to fetch return requests:', error);
    return NextResponse.json({ error: 'Failed to fetch return requests' }, { status: 500 });
  }
}
