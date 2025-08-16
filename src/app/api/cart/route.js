import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch cart items for authenticated user
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const { productId, size, color, quantity = 1, bespoke, customMeasurements } = await request.json();

    console.log('Cart API - Received data:', { productId, size, color, quantity, bespoke, customMeasurements });

    if (!productId || !color) {
      console.log('Cart API - Missing required fields:', { productId: !!productId, color: !!color });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // For bespoke items, size is optional (will be "Custom")
    if (!bespoke && !size) {
      console.log('Cart API - Size required for non-bespoke items');
      return NextResponse.json({ error: 'Size is required for regular items' }, { status: 400 });
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.quantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        size,
        color
      }
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: { product: true }
      });
      return NextResponse.json(updatedItem);
    } else {
      // Create new cart item
      const cartItemData = {
        userId,
        productId,
        size: size || 'Custom',
        color,
        quantity
      };

      // Add bespoke data if present
      if (bespoke) {
        cartItemData.bespoke = true;
        cartItemData.customMeasurements = JSON.stringify(customMeasurements);
      }

      const newCartItem = await prisma.cartItem.create({
        data: cartItemData,
        include: { product: true }
      });
      return NextResponse.json(newCartItem);
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// PUT - Update cart item quantity
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid cart item ID or quantity' }, { status: 400 });
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId
      },
      include: { product: true }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Check if product has enough stock
    if (cartItem.product.quantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true }
    });

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// DELETE - Remove item from cart or clear entire cart
export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('id');

    if (cartItemId) {
      // Remove specific cart item
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          userId
        }
      });

      if (!cartItem) {
        return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
      }

      await prisma.cartItem.delete({
        where: { id: cartItemId }
      });

      return NextResponse.json({ message: 'Item removed from cart' });
    } else {
      // Clear entire cart for the user
      await prisma.cartItem.deleteMany({
        where: { userId }
      });

      return NextResponse.json({ message: 'Cart cleared successfully' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}