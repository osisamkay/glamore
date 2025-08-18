import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request, { params }) {
  const { id } = params;
  const { status } = await request.json();

  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`Failed to update order ${id}:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
