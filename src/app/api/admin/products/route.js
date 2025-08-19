import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Optional: Check if the user is an admin
    // This depends on how you store roles. Assuming a `role` field on the User model.
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // if (user?.role !== 'admin') {
    //   return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    // }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // We need to calculate total quantity sold or on hand. The schema has `quantity` which is total inventory.
    // The design shows 'Total QTY', which I'll map from the `quantity` field.
    const formattedProducts = products.map(p => ({
      sku: `#${p.id.substring(0, 6).toUpperCase()}`,
      name: p.name,
      totalQty: p.quantity,
      buyPrice: p.buyPrice,
      sellPrice: p.price, // `price` from schema is the sell price
    }));

    return new NextResponse(JSON.stringify(formattedProducts), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
  }
}
