import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedProducts = products.map(p => ({
      sku: `#${p.id.substring(0, 6).toUpperCase()}`,
      name: p.name,
      totalQty: p.quantity,
      buyPrice: p.buyPrice,
      sellPrice: p.price,
    }));

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error.message,
      products: []
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
