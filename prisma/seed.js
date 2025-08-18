const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Import the product data
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.js');
const { featuredProducts } = require(productsPath);

const prisma = new PrismaClient();

// Helper function to convert hex colors to readable names
function hexToColorName(hex) {
  const colorMap = {
    '#FFA500': 'Orange',
    '#FF0000': 'Red',
    '#FFD700': 'Gold',
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#FFC0CB': 'Pink',
    '#C0C0C0': 'Silver',
    '#0000FF': 'Blue',
    '#000080': 'Navy',
    '#808080': 'Gray',
    '#008000': 'Green',
    '#800080': 'Purple',
    '#F5F5DC': 'Beige',
    '#8B4513': 'Brown',
    '#CD7F32': 'Bronze',
    '#E8B4A0': 'Rose Gold',
    '#FFFF00': 'Yellow',
    '#F0E68C': 'Khaki',
    '#654321': 'Dark Brown',
    '#D2B48C': 'Tan'
  };
  return colorMap[hex] || hex;
}

// Convert the existing product data to database format
function convertProductsToDbFormat(products) {
  return products.map(product => ({
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    colors: product.colors.map(hexToColorName).join(','),
    sizes: product.sizes.join(','),
    quantity: product.quantity,
    rating: 4.0 + Math.random() * 1, // Random rating between 4.0-5.0
    reviewCount: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
    description: `${product.tags.join(', ')} - Premium quality ${product.category}'s fashion item with authentic African-inspired design.`
  }));
}

// Combine all products from the existing data
const allProducts = [
  ...convertProductsToDbFormat(featuredProducts.women),
  ...convertProductsToDbFormat(featuredProducts.men),
  ...convertProductsToDbFormat(featuredProducts.kids)
];

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.giftCard.deleteMany();
    
    // Create users with roles
    console.log('👥 Creating users...');
    const users = [
      {
        email: 'admin@glamore.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        email: 'cs@glamore.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        firstName: 'Customer',
        lastName: 'Service',
        role: 'customer_service'
      },
      {
        email: 'customer@example.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        firstName: 'Jane',
        lastName: 'Customer',
        role: 'customer'
      }
    ];

    for (const user of users) {
      await prisma.user.create({ data: user });
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }
    
    // Seed products from existing data
    console.log('📦 Creating products from src/data/products.js...');
    for (const product of allProducts) {
      await prisma.product.create({
        data: product
      });
      console.log(`✅ Created: ${product.name}`);
    }
    
    // Create gift cards
    console.log('🎁 Creating gift cards...');
    const giftCards = [
      { code: 'WELCOME50', balance: 50.00 },
      { code: 'SAVE100', balance: 100.00 },
      { code: 'VIP200', balance: 200.00 }
    ];

    for (const card of giftCards) {
      await prisma.giftCard.create({ data: card });
      console.log(`✅ Created gift card: ${card.code} ($${card.balance})`);
    }
    
    // Get final count
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    const totalGiftCards = await prisma.giftCard.count();
    
    console.log(`\n🎉 Seeding completed!`);
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${totalUsers}`);
    console.log(`   📦 Products: ${totalProducts}`);
    console.log(`   🎁 Gift Cards: ${totalGiftCards}`);
    
    // Show breakdown by category
    const womenCount = await prisma.product.count({ where: { category: 'women' } });
    const menCount = await prisma.product.count({ where: { category: 'men' } });
    const kidsCount = await prisma.product.count({ where: { category: 'kids' } });
    
    console.log(`📊 Products by category:`);
    console.log(`   👗 Women: ${womenCount}`);
    console.log(`   👔 Men: ${menCount}`);
    console.log(`   👶 Kids: ${kidsCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
