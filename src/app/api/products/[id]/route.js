import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL);
    
    const result = await sql`SELECT * FROM "Product" WHERE id = ${id}`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = result[0];

    // Parse colors and sizes from comma-separated strings into proper arrays
    const parsedProduct = {
      ...product,
      colors: product.colors ? product.colors.split(',').map(c => c.trim()) : [],
      sizes: product.sizes ? product.sizes.split(',').map(s => s.trim()) : []
    };

    return NextResponse.json({
      success: true,
      product: parsedProduct
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}