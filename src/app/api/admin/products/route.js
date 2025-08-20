import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(req) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const products = await sql`
      SELECT id, name, quantity, "buyPrice", price, "createdAt"
      FROM "Product"
      ORDER BY "createdAt" DESC
    `;

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
  }
}
