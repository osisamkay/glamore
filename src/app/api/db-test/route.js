import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Test database connection with a simple query
    const result = await sql`SELECT COUNT(*) as count FROM "Product"`;
    const productCount = result[0]?.count || 0;
    
    return NextResponse.json({
      status: 'connected',
      message: 'Database connection successful',
      productCount: parseInt(productCount),
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
  }
}
