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
    // Clear existing products
    console.log('🧹 Clearing existing products...');
    await prisma.product.deleteMany();
    
    // Seed products from existing data
    console.log('📦 Creating products from src/data/products.js...');
    for (const product of allProducts) {
      await prisma.product.create({
        data: product
      });
      console.log(`✅ Created: ${product.name}`);
    }
    
    // Get final count
    const totalProducts = await prisma.product.count();
    console.log(`\n🎉 Seeding completed! Created ${totalProducts} products.`);
    
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
