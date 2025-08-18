import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request) {
  try {
    const totalSalesData = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    const totalVisitors = await prisma.user.count();

    const totalRefunds = await prisma.order.count({
        where: { status: 'REFUNDED' },
      });

    return NextResponse.json({
      totalSales: totalSalesData._sum.total || 0,
      visitors: totalVisitors,
      refunds: totalRefunds,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
  }
}
