const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function addOrderColumns() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Adding new columns to Order table...');
    
    // Add the new columns to the Order table
    await sql`
      ALTER TABLE "Order" 
      ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT,
      ADD COLUMN IF NOT EXISTS "refundReason" TEXT,
      ADD COLUMN IF NOT EXISTS "refundedAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "cancelReason" TEXT,
      ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "packagedAt" TIMESTAMP
    `;
    
    console.log('Successfully added new columns to Order table!');
    
    // Verify the columns were added
    const result = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
      AND column_name IN ('trackingNumber', 'refundReason', 'refundedAt', 'confirmedAt', 'cancelReason', 'cancelledAt', 'packagedAt')
      ORDER BY column_name
    `;
    
    console.log('New columns added:');
    result.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
  } catch (error) {
    console.error('Error adding columns:', error);
  }
}

addOrderColumns();
