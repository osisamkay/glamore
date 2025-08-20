import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // TODO: Add proper authentication once Clerk is properly configured
    // const { userId } = getAuth(req);
    // if (!userId) {
    //   return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
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
