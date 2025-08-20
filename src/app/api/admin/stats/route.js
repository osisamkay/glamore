import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const totalSalesResult = await sql`
      SELECT COALESCE(SUM(total), 0) as total_sales FROM "Order"
    `;

    const totalVisitorsResult = await sql`
      SELECT COUNT(*) as count FROM "User"
    `;

    const totalRefundsResult = await sql`
      SELECT COUNT(*) as count FROM "Order" WHERE status = 'REFUNDED'
    `;

    return NextResponse.json({
      totalSales: parseFloat(totalSalesResult[0].total_sales) || 0,
      visitors: parseInt(totalVisitorsResult[0].count) || 0,
      refunds: parseInt(totalRefundsResult[0].count) || 0,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
  }
}
