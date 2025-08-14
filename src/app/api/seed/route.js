import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { featuredProducts } from '@/data/products';

export async function POST() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if featuredProducts is imported correctly
    if (!featuredProducts) {
      console.error('❌ featuredProducts is undefined!');
      return NextResponse.json({ error: 'featuredProducts import failed' }, { status: 500 });
    }
    
    console.log('📊 featuredProducts structure:', Object.keys(featuredProducts));
    console.log('👩 Women products count:', featuredProducts.women?.length || 0);
    console.log('👨 Men products count:', featuredProducts.men?.length || 0);
    console.log('👶 Kids products count:', featuredProducts.kids?.length || 0);

    // Clear existing products
    await prisma.product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Get all products from all categories
    const allProducts = [
      ...(featuredProducts.women || []),
      ...(featuredProducts.men || []),
      ...(featuredProducts.kids || [])
    ];

    console.log(`📦 Seeding ${allProducts.length} products...`);
    if (allProducts.length > 0) {
      console.log('🔍 First product sample:', JSON.stringify(allProducts[0], null, 2));
    } else {
      console.error('❌ No products found to seed!');
      return NextResponse.json({ error: 'No products found in featuredProducts' }, { status: 400 });
    }

    // Seed all products
    const createdProducts = [];
    for (const product of allProducts) {
      try {
        const createdProduct = await prisma.product.create({
          data: {
            name: product.name,
            image: product.image,
            price: product.price,
            category: product.category,
            color: product.color,
            sizes: product.size.join(','), // Convert array to comma-separated string
            description: generateDescription(product)
          }
        });
        createdProducts.push(createdProduct);
        console.log(`✅ Added: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${product.name}:`, error.message);
        console.error('Product data:', JSON.stringify(product, null, 2));
      }
    }

    const totalCount = await prisma.product.count();
    console.log(`✨ Database seeding completed! Total products: ${totalCount}`);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      productsAdded: createdProducts.length,
      totalProducts: totalCount
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}

// Generate product descriptions based on name and tags
function generateDescription(product) {
  const { name, tags, color, category } = product;
  
  const descriptions = {
    'Ankara': `Beautiful ${name} featuring authentic Ankara fabric with vibrant patterns. This ${category}'s piece combines traditional African aesthetics with modern design.`,
    'Dashiki': `Traditional ${name} crafted with classic Dashiki styling. Perfect for cultural events or adding an authentic African touch to your wardrobe.`,
    'Kente': `Stunning ${name} made with traditional Kente-inspired patterns. A symbol of African heritage and cultural pride.`,
    'Agbada': `Elegant ${name} in the classic Agbada style. This traditional flowing garment is perfect for special occasions and cultural celebrations.`,
    'Blazer': `Sophisticated ${name} that blends African prints with contemporary tailoring. Ideal for professional settings with cultural flair.`,
    'Accessory': `Handcrafted ${name} that adds the perfect finishing touch to any outfit. Authentic African-inspired design meets modern style.`,
    'Dress': `Graceful ${name} designed to celebrate feminine elegance with African-inspired patterns and comfortable fit.`,
    'Jumpsuit': `Modern ${name} featuring bold African prints. A versatile piece that transitions effortlessly from day to evening.`,
    'Kaftan': `Flowing ${name} in traditional kaftan style. Comfortable, elegant, and perfect for warm weather or relaxed occasions.`,
    'Boubou': `Majestic ${name} in the grand boubou tradition. A statement piece that embodies African royal heritage and elegance.`,
    'Gown': `Elegant ${name} perfect for special occasions. Features beautiful African-inspired design with modern sophistication.`,
    'Top': `Stylish ${name} that combines comfort with authentic African patterns. Perfect for everyday wear with cultural flair.`,
    'Pants': `Comfortable ${name} featuring traditional African prints. Versatile piece that works for both casual and semi-formal occasions.`,
    'Shirt': `Classic ${name} with authentic African styling. Perfect for expressing cultural pride in everyday wear.`,
    'Tee': `Casual ${name} featuring African-inspired designs. Comfortable and stylish for everyday activities.`
  };

  // Find matching description based on tags
  for (const tag of tags) {
    if (descriptions[tag]) {
      return descriptions[tag];
    }
  }

  // Default description
  return `Beautiful ${name} in ${color.toLowerCase()} featuring authentic African-inspired design. This ${category}'s piece combines traditional aesthetics with contemporary style, perfect for expressing your unique fashion sense.`;
}
