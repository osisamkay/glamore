import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const orderData = await request.json();
    
    // Create order in database
    const order = await prisma.order.create({
      data: {
        // Shipping information
        firstName: orderData.shipping.firstName,
        lastName: orderData.shipping.lastName,
        email: orderData.shipping.email,
        phone: orderData.shipping.phone,
        address: orderData.shipping.address,
        city: orderData.shipping.city,
        province: orderData.shipping.province,
        zipCode: orderData.shipping.zipCode,
        deliveryType: orderData.shipping.deliveryType,
        
        // Payment information
        paymentMethod: orderData.payment.method,
        giftCardCode: orderData.payment.giftCardCode || null,
        giftCardAmount: orderData.payment.giftCardAmount || 0,
        
        // Order totals
        subtotal: orderData.totals.subtotal,
        salesTax: orderData.totals.salesTax,
        shipping: orderData.totals.shipping,
        total: orderData.totals.total,
        
        // Order status
        status: 'pending',
        
        // Create order items
        items: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            image: item.image
          }))
        }
      },
      include: {
        items: true
      }
    });

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
      // Get specific order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, order });
    } else {
      // Get all orders (for admin)
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      });
      
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
