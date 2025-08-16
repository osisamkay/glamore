import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Get orders with status 'delivered', 'cancelled', or 'completed'
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['delivered', 'cancelled', 'completed']
        }
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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
