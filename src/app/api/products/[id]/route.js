import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Parse colors and sizes from comma-separated strings to arrays
    const productWithArrays = {
      ...product,
      colors: product.colors ? product.colors.split(',').map(c => c.trim()) : [],
      sizes: product.sizes ? product.sizes.split(',').map(s => s.trim()) : [],
    };

    return NextResponse.json(productWithArrays);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}