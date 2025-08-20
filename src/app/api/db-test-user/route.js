import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Test if User table exists and get its structure
    const userTableCheck = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND table_schema = 'public'
    `;
    
    // Try to count users
    let userCount = 0;
    try {
      const result = await sql`SELECT COUNT(*) as count FROM "User"`;
      userCount = parseInt(result[0]?.count || 0);
    } catch (e) {
      console.log('User table query failed:', e.message);
    }
    
    return NextResponse.json({
      status: 'success',
      userTableExists: userTableCheck.length > 0,
      userTableColumns: userTableCheck,
      userCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
