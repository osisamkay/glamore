import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request) {
  try {
    // Get sales data for the last 12 months
    const salesData = await prisma.$queryRaw`
      SELECT
        strftime('%Y-%m', "createdAt") as month,
        SUM(total) as totalSales
      FROM "Order"
      WHERE "createdAt" >= strftime('%Y-%m-%d %H:%M:%S', date('now', '-12 months'))
      GROUP BY month
      ORDER BY month;
    `;

    // Format data for the chart
    const formattedData = salesData.map(item => ({
      name: item.month,
      'Total Sales': item.totalSales,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching sales chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch sales chart data' }, { status: 500 });
  }
}
