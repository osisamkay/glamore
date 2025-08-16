import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { itemIds, reason } = await request.json();

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is delivered (can only return delivered orders)
    if (order.status !== 'delivered') {
      return NextResponse.json(
        { success: false, error: 'Can only return delivered orders' },
        { status: 400 }
      );
    }

    // Check if order is within return window (30 days)
    const deliveryDate = order.deliveredAt || order.createdAt;
    const daysSinceDelivery = Math.floor((new Date() - new Date(deliveryDate)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceDelivery > 30) {
      return NextResponse.json(
        { success: false, error: 'Return window has expired (30 days)' },
        { status: 400 }
      );
    }

    // Create return request
    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId: id,
        reason: reason,
        status: 'pending',
        requestedAt: new Date(),
        // TODO: Add userId when user authentication is implemented
        customerEmail: order.email,
        items: {
          create: itemIds.map(itemId => {
            const orderItem = order.items.find(item => item.id === itemId);
            return {
              orderItemId: itemId,
              productId: orderItem.productId,
              quantity: orderItem.quantity,
              price: orderItem.price
            };
          })
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Return request submitted successfully',
      returnRequest: {
        id: returnRequest.id,
        status: returnRequest.status,
        itemCount: returnRequest.items.length
      }
    });

  } catch (error) {
    console.error('Error submitting return request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit return request' },
      { status: 500 }
    );
  }
}
