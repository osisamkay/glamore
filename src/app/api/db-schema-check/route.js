import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Check which tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    const tableNames = tables.map(t => t.table_name);
    
    // Check User table structure if it exists
    let userColumns = [];
    if (tableNames.includes('User')) {
      userColumns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'User' AND table_schema = 'public'
        ORDER BY ordinal_position
      `;
    }
    
    return NextResponse.json({
      status: 'success',
      existingTables: tableNames,
      userTableExists: tableNames.includes('User'),
      userTableColumns: userColumns,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Schema check error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Schema check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
