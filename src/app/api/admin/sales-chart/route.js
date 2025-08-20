import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Get sales data for the last 12 months (PostgreSQL syntax)
    const salesData = await sql`
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        SUM(total) as "totalSales"
      FROM "Order"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month;
    `;

    // Format data for the chart
    const formattedData = salesData.map(item => ({
      name: item.month,
      'Total Sales': parseFloat(item.totalSales) || 0,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching sales chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch sales chart data' }, { status: 500 });
  }
}
