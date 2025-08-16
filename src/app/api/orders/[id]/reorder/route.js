import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { id } = params;

    // Find the order with its items
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

    // Get user session/ID (for now, we'll use a placeholder)
    // In a real app, you'd get this from the session
    const userId = null; // TODO: Get from session
    const sessionId = 'guest-session'; // TODO: Get from session

    // Add each order item to cart
    const cartItems = [];
    for (const item of order.items) {
      // Check if product still exists and has inventory
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        console.warn(`Product ${item.productId} no longer exists`);
        continue;
      }

      // Check if item already exists in cart
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          productId: item.productId,
          size: item.size,
          color: item.color,
          ...(userId ? { userId } : { sessionId })
        }
      });

      if (existingCartItem) {
        // Update quantity
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + item.quantity
          }
        });
        cartItems.push(updatedItem);
      } else {
        // Create new cart item
        const newCartItem = await prisma.cartItem.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            userId: userId,
            sessionId: userId ? null : sessionId
          }
        });
        cartItems.push(newCartItem);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${cartItems.length} items added to cart`,
      cartItems: cartItems.length
    });

  } catch (error) {
    console.error('Error reordering:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder items' },
      { status: 500 }
    );
  }
}
