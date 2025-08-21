import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { featuredProducts } from '../../../data/products.js';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('Starting comprehensive database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await sql`DELETE FROM "Order"`;
    await sql`DELETE FROM "GiftCard"`;
    await sql`DELETE FROM "Product"`;
    await sql`DELETE FROM "User"`;
    
    // Seed data
    await seedUsers(sql);
    await seedProducts(sql);
    await seedGiftCards(sql);
    // await seedOrders(sql); // Orders seeding function not implemented yet
    
    // Verify seeding
    const productCount = await sql`SELECT COUNT(*) as count FROM "Product"`;
    const womenCount = await sql`SELECT COUNT(*) as count FROM "Product" WHERE category = 'women'`;
    const menCount = await sql`SELECT COUNT(*) as count FROM "Product" WHERE category = 'men'`;
    const kidsCount = await sql`SELECT COUNT(*) as count FROM "Product" WHERE category = 'kids'`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully with all data',
      timestamp: new Date().toISOString(),
      counts: {
        total: productCount[0].count,
        women: womenCount[0].count,
        men: menCount[0].count,
        kids: kidsCount[0].count
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
}

async function createTables(sql) {
  console.log('Creating tables...');
  
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
  
  // Create Product table
  await sql`
    CREATE TABLE IF NOT EXISTS "Product" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      price DECIMAL NOT NULL,
      "buyPrice" DECIMAL DEFAULT 0,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      colors TEXT,
      sizes TEXT,
      quantity INTEGER DEFAULT 50,
      rating DECIMAL DEFAULT 4.0,
      "reviewCount" INTEGER DEFAULT 0,
      description TEXT,
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
  
  // Add missing timestamp columns if they don't exist
  try {
    await sql`ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW()`;
    await sql`ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT NOW()`;
  } catch (error) {
    console.log('Timestamp columns may already exist:', error.message);
  }
}

async function clearExistingData(sql) {
  console.log('Clearing existing data...');
  
  await sql`DELETE FROM "OrderItem"`;
  await sql`DELETE FROM "Order"`;
  await sql`DELETE FROM "GiftCard"`;
  await sql`DELETE FROM "Product"`;
  await sql`DELETE FROM "User"`;
}

async function seedUsers(sql) {
  console.log('Seeding users...');
  
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  // Admin user
  await sql`
    INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), 'admin@ggfashions.com', ${hashedPassword}, 'Admin User', 'admin', NOW(), NOW())
  `;
  
  // Customer Service user
  await sql`
    INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), 'cs@ggfashions.com', ${hashedPassword}, 'Customer Service', 'cs', NOW(), NOW())
  `;
  
  // Regular users
  const regularUsers = [
    { email: 'john.doe@example.com', name: 'John Doe' },
    { email: 'jane.smith@example.com', name: 'Jane Smith' },
    { email: 'mike.johnson@example.com', name: 'Mike Johnson' },
    { email: 'sarah.wilson@example.com', name: 'Sarah Wilson' },
    { email: 'david.brown@example.com', name: 'David Brown' },
    { email: 'emily.jones@example.com', name: 'Emily Jones' },
    { email: 'chris.green@example.com', name: 'Chris Green' },
    { email: 'lisa.white@example.com', name: 'Lisa White' },
    { email: 'kevin.hall@example.com', name: 'Kevin Hall' },
    { email: 'sandra.adams@example.com', name: 'Sandra Adams' }
  ];
  
  for (const user of regularUsers) {
    await sql`
      INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${user.email}, ${hashedPassword}, ${user.name}, 'user', NOW(), NOW())
    `;
  }
}


async function seedProducts(sql) {
  console.log('Seeding products from src/data/products.js...');

  const allProducts = [
    ...featuredProducts.women,
    ...featuredProducts.men,
    ...featuredProducts.kids
  ];

  console.log(`Total products to seed: ${allProducts.length}`);
  console.log(`Women: ${featuredProducts.women.length}, Men: ${featuredProducts.men.length}, Kids: ${featuredProducts.kids.length}`);

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    try {
      await sql`
        INSERT INTO "Product" (id, name, price, "buyPrice", image, category, colors, sizes, description, quantity, rating, "reviewCount", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(), 
          ${product.name}, 
          ${product.price}, 
          ${product.price / 2}, 
          ${product.image}, 
          ${product.category}, 
          ${JSON.stringify(product.colors)}, 
          ${JSON.stringify(product.sizes)}, 
          ${product.tags.join(', ')}, 
          ${product.quantity}, 
          4.5, 
          20, 
          NOW(), 
          NOW()
        )
      `;
      console.log(`Seeded product ${i + 1}/${allProducts.length}: ${product.name}`);
    } catch (error) {
      console.error(`Error seeding product ${product.name}:`, error);
    }
  }
}

async function seedGiftCards(sql) {
  console.log('Seeding gift cards...');
  
  const giftCards = [
    { code: 'GIFT50', balance: 50.00, expiresAt: null },
    { code: 'GIFT100', balance: 100.00, expiresAt: null },
    { code: 'GIFT25', balance: 25.00, expiresAt: null },
    { code: 'WELCOME20', balance: 20.00, expiresAt: null },
    { 
      code: 'EXPIRED10', 
      balance: 10.00, 
      // Set expiration to yesterday
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const card of giftCards) {
    await sql`
      INSERT INTO "GiftCard" (id, code, balance, "isActive", "expiresAt", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${card.code}, ${card.balance}, true, ${card.expiresAt}, NOW(), NOW())
    `;
  }
}

async function seedSampleOrders(sql) {
  console.log('Seeding sample orders...');
  
  // Get some product IDs for order items
  const products = await sql`SELECT id, name, price, image FROM "Product" LIMIT 5`;
  
  if (products.length === 0) return;
  
  // Create sample orders
  const sampleOrders = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      address: '123 Main St',
      city: 'New York',
      province: 'NY',
      zipCode: '10001',
      status: 'delivered',
      total: 159.98
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0124',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      province: 'CA',
      zipCode: '90210',
      status: 'pending',
      total: 89.99
    },
    {
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1-555-0125',
      address: '789 Pine St',
      city: 'Chicago',
      province: 'IL',
      zipCode: '60601',
      status: 'shipped',
      total: 124.97
    }
  ];
  
  for (const order of sampleOrders) {
    const orderResult = await sql`
      INSERT INTO "Order" (id, "firstName", "lastName", email, phone, address, city, province, "zipCode", 
                          status, subtotal, "salesTax", shipping, total, "paymentMethod", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${order.firstName}, ${order.lastName}, ${order.email}, ${order.phone}, ${order.address}, 
              ${order.city}, ${order.province}, ${order.zipCode}, ${order.status}, 
              ${order.total * 0.9}, ${order.total * 0.08}, 5.99, ${order.total}, 'card', NOW(), NOW())
      RETURNING id
    `;
    
    const orderId = orderResult[0].id;
    
    // Add 1-2 items to each order
    const numItems = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numItems; i++) {
      const product = products[i % products.length];
      await sql`
        INSERT INTO "OrderItem" (id, "orderId", "productId", name, price, quantity, color, size, image, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${orderId}, ${product.id}, ${product.name}, ${product.price}, 1, 'Black', 'M', ${product.image}, NOW(), NOW())
      `;
    }
  }
}
