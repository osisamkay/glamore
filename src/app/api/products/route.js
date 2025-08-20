import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const body = await request.json();
    const { category, limit = 20, search } = body;

    let products;
    
    if (category && category !== 'all' && search) {
      products = await sql`
        SELECT * FROM "Product" 
        WHERE category = ${category} AND (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;
    } else if (category && category !== 'all') {
      products = await sql`
        SELECT * FROM "Product" 
        WHERE category = ${category}
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;
    } else if (search) {
      products = await sql`
        SELECT * FROM "Product" 
        WHERE name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`}
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;
    } else {
      products = await sql`
        SELECT * FROM "Product" 
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search');

    let products;
    
    if (category && category !== 'all' && search) {
      products = await sql`
        SELECT * FROM "Product" 
        WHERE category = ${category} AND (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;
    } else if (category && category !== 'all') {
      products = await sql`
        SELECT * FROM "Product" 
        WHERE category = ${category}
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;
    } else if (search) {
      products = await sql`
        SELECT * FROM "Product" 
        WHERE name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`}
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;
    } else {
      products = await sql`
        SELECT * FROM "Product" 
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;
    }

    // Parse colors and sizes from comma-separated strings
    const parsedProducts = products.map(product => ({
      ...product,
      colors: product.colors ? product.colors.split(',') : [],
      sizes: product.sizes ? product.sizes.split(',') : []
    }));

    return NextResponse.json({
      success: true,
      products: parsedProducts,
      count: parsedProducts.length
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}