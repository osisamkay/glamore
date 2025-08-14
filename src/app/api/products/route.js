import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, limit = 20, search } = body;

    let whereClause = {};
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search');

    let whereClause = {};
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

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