import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const orderData = await request.json();
    
    console.log('Received order data:', JSON.stringify(orderData, null, 2));
    
    // Validate required fields
    if (!orderData.shipping || !orderData.payment || !orderData.items || !orderData.totals) {
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Create order in database
    const orderResult = await sql`
      INSERT INTO "Order" (
        id, "firstName", "lastName", email, phone, address, city, province, "zipCode", 
        "deliveryType", "paymentMethod", "giftCardCode", "giftCardAmount", 
        subtotal, "salesTax", shipping, total, status, "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), ${orderData.shipping.firstName || ''}, ${orderData.shipping.lastName || ''}, 
        ${orderData.shipping.email || ''}, ${orderData.shipping.phone || ''}, ${orderData.shipping.address || ''}, 
        ${orderData.shipping.city || ''}, ${orderData.shipping.province || ''}, ${orderData.shipping.zipCode || ''}, 
        ${orderData.shipping.deliveryType || 'normal'}, ${orderData.payment.method || 'card'}, 
        ${orderData.payment.giftCardCode || null}, ${parseFloat(orderData.payment.giftCardAmount) || 0}, 
        ${parseFloat(orderData.totals.subtotal) || 0}, ${parseFloat(orderData.totals.salesTax) || 0}, 
        ${parseFloat(orderData.totals.shipping) || 0}, ${parseFloat(orderData.totals.total) || 0}, 
        'pending', NOW(), NOW()
      ) RETURNING *
    `;
    
    const order = orderResult[0];
    
    // Create order items
    for (const item of orderData.items) {
      await sql`
        INSERT INTO "OrderItem" (
          id, "orderId", "productId", name, price, quantity, color, size, image, "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), ${order.id}, ${item.productId || ''}, ${item.name || ''}, 
          ${parseFloat(item.price) || 0}, ${parseInt(item.quantity) || 1}, 
          ${item.color || ''}, ${item.size || ''}, ${item.image || ''}, NOW(), NOW()
        )
      `;
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        orderNumber: `GGF-${order.id.slice(-8).toUpperCase()}`,
        total: order.total,
        status: order.status
      }
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    
    if (orderId) {
      const sql = neon(process.env.DATABASE_URL);
      
      // Get specific order
      const orderResult = await sql`
        SELECT * FROM "Order" WHERE id = ${orderId}
      `;
      
      if (orderResult.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      
      const order = orderResult[0];
      
      // Get order items
      const items = await sql`
        SELECT * FROM "OrderItem" WHERE "orderId" = ${orderId}
      `;
      
      order.items = items;
      
      return NextResponse.json({ success: true, order });
    } else {
      const sql = neon(process.env.DATABASE_URL);
      
      // Get all orders (for admin)
      const ordersResult = await sql`
        SELECT * FROM "Order" ORDER BY "createdAt" DESC
      `;
      
      // Get items for each order
      const orders = [];
      for (const order of ordersResult) {
        const items = await sql`
          SELECT * FROM "OrderItem" WHERE "orderId" = ${order.id}
        `;
        orders.push({ ...order, items });
      }
      
      return NextResponse.json({ success: true, orders });
    }
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
