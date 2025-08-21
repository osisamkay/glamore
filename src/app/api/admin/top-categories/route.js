import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Get top categories by order quantity
    const topCategories = await sql`
      SELECT 
        p.category as name,
        SUM(oi.quantity) as sales
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      GROUP BY p.category
      ORDER BY SUM(oi.quantity) DESC
      LIMIT 5
    `;

    return NextResponse.json(topCategories);
  } catch (error) {
    console.error('Error fetching top categories:', error);
    return NextResponse.json({ error: 'Failed to fetch top categories' }, { status: 500 });
  }
}
