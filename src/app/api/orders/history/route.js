import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Get orders with status 'delivered', 'cancelled', or 'completed'
    const ordersResult = await sql`
      SELECT * FROM "Order" 
      WHERE status IN ('delivered', 'cancelled', 'completed')
      ORDER BY "createdAt" DESC
    `;
    
    // Get items for each order
    const orders = [];
    for (const order of ordersResult) {
      const items = await sql`
        SELECT * FROM "OrderItem" WHERE "orderId" = ${order.id}
      `;
      orders.push({ ...order, items });
    }

    return NextResponse.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('Error fetching order history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order history' },
      { status: 500 }
    );
  }
}
