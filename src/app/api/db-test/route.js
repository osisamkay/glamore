import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  let prisma;
  
  try {
    prisma = new PrismaClient();
    
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const productCount = await prisma.product.count();
    
    return NextResponse.json({
      status: 'connected',
      message: 'Database connection successful',
      productCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
