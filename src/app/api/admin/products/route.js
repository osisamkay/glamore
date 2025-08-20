import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

let prisma;

// Initialize Prisma with error handling
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma:', error);
}

export async function GET(req) {
  try {
    // TODO: Add proper authentication once Clerk is properly configured
    // const { userId } = getAuth(req);
    // if (!userId) {
    //   return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    // }

    // Check if Prisma is available
    if (!prisma) {
      console.error('Prisma client not initialized');
      return NextResponse.json({ 
        error: 'Database connection failed',
        products: [] // Return empty array as fallback
      }, { status: 500 });
    }

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

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error.message,
      products: [] // Return empty array as fallback
    }, { status: 500 });
  } finally {
    // Clean up Prisma connection
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
