import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request, { params }) {
  const { id } = params;
  const { status } = await request.json();

  if (!status || !['Approved', 'Rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
  }

  try {
    const updatedReturnRequest = await prisma.returnRequest.update({
      where: { id },
      data: {
        status,
        processedAt: new Date(),
      },
      include: {
        items: {
          include: {
            orderItem: true,
          },
        },
      },
    });

    return NextResponse.json(updatedReturnRequest);
  } catch (error) {
    console.error(`Failed to update return request ${id}:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update return request' }, { status: 500 });
  }
}
