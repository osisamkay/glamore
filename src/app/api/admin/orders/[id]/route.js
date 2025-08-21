import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const { status, action, trackingNumber, refundReason } = body;

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Handle different actions
    if (action === 'refund') {
      // Update order status to refunded
      await sql`
        UPDATE "Order" 
        SET status = 'Refunded'
        WHERE id = ${id}
      `;

      // Get updated order with items
      const [updatedOrder] = await sql`
        SELECT o.*, 
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'name', p.name,
                   'price', oi.price,
                   'quantity', oi.quantity,
                   'image', p.image
                 )
               ) as items
        FROM "Order" o
        LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
        LEFT JOIN "Product" p ON oi."productId" = p.id
        WHERE o.id = ${id}
        GROUP BY o.id
      `;

      return NextResponse.json(updatedOrder);
    }

    if (action === 'confirm') {
      // Confirm order - update status to Confirmed
      await sql`
        UPDATE "Order" 
        SET status = 'Confirmed'
        WHERE id = ${id}
      `;

      // Get updated order with items
      const [updatedOrder] = await sql`
        SELECT o.*, 
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'name', p.name,
                   'price', oi.price,
                   'quantity', oi.quantity,
                   'image', p.image
                 )
               ) as items
        FROM "Order" o
        LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
        LEFT JOIN "Product" p ON oi."productId" = p.id
        WHERE o.id = ${id}
        GROUP BY o.id
      `;

      return NextResponse.json(updatedOrder);
    }

    if (action === 'cancel') {
      // Cancel order with reason
      await sql`
        UPDATE "Order" 
        SET status = 'Cancelled'
        WHERE id = ${id}
      `;

      // Get updated order with items
      const [updatedOrder] = await sql`
        SELECT o.*, 
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'name', p.name,
                   'price', oi.price,
                   'quantity', oi.quantity,
                   'image', p.image
                 )
               ) as items
        FROM "Order" o
        LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
        LEFT JOIN "Product" p ON oi."productId" = p.id
        WHERE o.id = ${id}
        GROUP BY o.id
      `;

      return NextResponse.json(updatedOrder);
    }

    if (action === 'package') {
      // Package order - update status to Packaged
      await sql`
        UPDATE "Order" 
        SET status = 'Packaged'
        WHERE id = ${id}
      `;

      // Get updated order with items
      const [updatedOrder] = await sql`
        SELECT o.*, 
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'name', p.name,
                   'price', oi.price,
                   'quantity', oi.quantity,
                   'image', p.image
                 )
               ) as items
        FROM "Order" o
        LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
        LEFT JOIN "Product" p ON oi."productId" = p.id
        WHERE o.id = ${id}
        GROUP BY o.id
      `;

      return NextResponse.json(updatedOrder);
    }

    if (action === 'track') {
      // Update status to shipped for now (tracking number will be added later when DB is updated)
      await sql`
        UPDATE "Order" 
        SET status = CASE WHEN status = 'Paid' THEN 'Shipped' ELSE status END
        WHERE id = ${id}
      `;

      // Get updated order with items
      const [updatedOrder] = await sql`
        SELECT o.*, 
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'name', p.name,
                   'price', oi.price,
                   'quantity', oi.quantity,
                   'image', p.image
                 )
               ) as items
        FROM "Order" o
        LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
        LEFT JOIN "Product" p ON oi."productId" = p.id
        WHERE o.id = ${id}
        GROUP BY o.id
      `;

      return NextResponse.json(updatedOrder);
    }

    // Default status update
    if (!status) {
      return NextResponse.json({ error: 'Status or action is required' }, { status: 400 });
    }

    await sql`
      UPDATE "Order" 
      SET status = ${status}
      WHERE id = ${id}
    `;

    // Get updated order with items
    const [updatedOrder] = await sql`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'name', p.name,
                 'price', oi.price,
                 'quantity', oi.quantity,
                 'image', p.image
               )
             ) as items
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
      LEFT JOIN "Product" p ON oi."productId" = p.id
      WHERE o.id = ${id}
      GROUP BY o.id
    `;

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`Failed to update order ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
