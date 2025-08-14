import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();
    const cartItemCount = await prisma.cartItem.count();

    const sampleProducts = await prisma.product.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        category: true,
        price: true
      }
    });

    return NextResponse.json({
      success: true,
      counts: {
        products: productCount,
        users: userCount,
        cartItems: cartItemCount
      },
      sampleProducts
    });

  } catch (error) {
    console.error('Database status check failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
