import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Create User table
    await sql`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Create Order table
    await sql`
      CREATE TABLE IF NOT EXISTS "Order" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "firstName" TEXT DEFAULT '',
        "lastName" TEXT DEFAULT '',
        email TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        address TEXT DEFAULT '',
        city TEXT DEFAULT '',
        province TEXT DEFAULT '',
        "zipCode" TEXT DEFAULT '',
        "deliveryType" TEXT DEFAULT 'normal',
        "paymentMethod" TEXT DEFAULT 'card',
        "giftCardCode" TEXT,
        "giftCardAmount" DECIMAL DEFAULT 0,
        subtotal DECIMAL DEFAULT 0,
        "salesTax" DECIMAL DEFAULT 0,
        shipping DECIMAL DEFAULT 0,
        total DECIMAL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Create OrderItem table
    await sql`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "orderId" TEXT NOT NULL,
        "productId" TEXT DEFAULT '',
        name TEXT DEFAULT '',
        price DECIMAL DEFAULT 0,
        quantity INTEGER DEFAULT 1,
        color TEXT DEFAULT '',
        size TEXT DEFAULT '',
        image TEXT DEFAULT '',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE
      )
    `;
    
    // Create GiftCard table
    await sql`
      CREATE TABLE IF NOT EXISTS "GiftCard" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        code TEXT UNIQUE NOT NULL,
        balance DECIMAL NOT NULL,
        "isActive" BOOLEAN DEFAULT true,
        "expiresAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Create CartItem table
    await sql`
      CREATE TABLE IF NOT EXISTS "CartItem" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "productId" TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        size TEXT NOT NULL,
        color TEXT NOT NULL,
        "userId" TEXT,
        "sessionId" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
        FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE
      )
    `;
    
    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Table creation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create tables',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
