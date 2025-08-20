import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Clear existing products
    await sql`DELETE FROM "Product"`;
    
    // Seed products
    const products = [
      {
        name: "Ankara Bliss Gown",
        price: 45000,
        buyPrice: 25000,
        image: "/Women's GGF Photos/Ankara Bliss Gown, homepage.jpg",
        category: "women",
        colors: "Red,Blue,Green",
        sizes: "S,M,L,XL",
        quantity: 15,
        description: "Beautiful Ankara gown perfect for special occasions"
      },
      {
        name: "Eyo Junior Shirt",
        price: 22000,
        buyPrice: 12000,
        image: "/Kids GGF Photos/Eyo Junior Shirt.jpg",
        category: "kids",
        colors: "White,Blue",
        sizes: "XS,S,M",
        quantity: 8,
        description: "Traditional Eyo design shirt for kids"
      },
      {
        name: "Black Patch Dress",
        price: 35000,
        buyPrice: 18000,
        image: "/Men's GGF Photos/Black Patch Dress.jpg",
        category: "men",
        colors: "Black,Navy",
        sizes: "M,L,XL,XXL",
        quantity: 12,
        description: "Elegant black patch dress for men"
      },
      {
        name: "Brown Necklace",
        price: 15000,
        buyPrice: 8000,
        image: "/Men's GGF Photos/Brown Necklace.png",
        category: "men",
        colors: "Brown,Gold",
        sizes: "One Size",
        quantity: 20,
        description: "Stylish brown necklace for men"
      },
      {
        name: "Bow Ankara Shirt",
        price: 18000,
        buyPrice: 10000,
        image: "/Kids GGF Photos/Bow Ankara Shirt.jpg",
        category: "kids",
        colors: "Multi,Colorful",
        sizes: "XS,S,M",
        quantity: 10,
        description: "Colorful Ankara shirt with bow design for kids"
      },
      {
        name: "Ankara Clutch Luxe",
        price: 12000,
        buyPrice: 6000,
        image: "/Women's GGF Photos/Ankara Cluch Luxe.png",
        category: "women",
        colors: "Multi,Pattern",
        sizes: "One Size",
        quantity: 25,
        description: "Luxurious Ankara clutch bag for special occasions"
      },
      {
        name: "Beatea Dress",
        price: 38000,
        buyPrice: 20000,
        image: "/Women's GGF Photos/Beatea.png",
        category: "women",
        colors: "Blue,White",
        sizes: "S,M,L,XL",
        quantity: 18,
        description: "Elegant Beatea dress with modern African styling"
      }
    ];

    let createdCount = 0;
    for (const product of products) {
      await sql`
        INSERT INTO "Product" (id, name, price, "buyPrice", image, category, colors, sizes, quantity, description, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${product.name}, ${product.price}, ${product.buyPrice}, ${product.image}, ${product.category}, ${product.colors}, ${product.sizes}, ${product.quantity}, ${product.description}, NOW(), NOW())
      `;
      createdCount++;
    }

    const result = await sql`SELECT COUNT(*) as count FROM "Product"`;
    const totalCount = parseInt(result[0].count);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      productsAdded: createdCount,
      totalProducts: totalCount
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      error: 'Failed to seed database',
      details: error.message
    }, { status: 500 });
  }
}

// Generate multiple colors for each product
function generateColors(product) {
  const baseColor = product.color;
  const colorVariations = {
    'Orange': ['Orange', 'Coral', 'Peach', 'Burnt Orange'],
    'Pink': ['Pink', 'Rose', 'Blush', 'Magenta'],
    'Blue': ['Blue', 'Navy', 'Royal Blue', 'Sky Blue'],
    'Black': ['Black', 'Charcoal', 'Midnight', 'Ebony'],
    'White': ['White', 'Ivory', 'Cream', 'Pearl'],
    'Green': ['Green', 'Forest', 'Emerald', 'Sage'],
    'Purple': ['Purple', 'Plum', 'Lavender', 'Violet'],
    'Brown': ['Brown', 'Tan', 'Chocolate', 'Camel'],
    'Red': ['Red', 'Crimson', 'Burgundy', 'Cherry'],
    'Yellow': ['Yellow', 'Gold', 'Amber', 'Mustard'],
    'Multi-color': ['Multi-color', 'Rainbow', 'Patterned', 'Mixed']
  };
  
  return colorVariations[baseColor] || [baseColor, 'Black', 'White', 'Navy'];
}

// Generate at least 5 sizes based on category
function generateSizes(category) {
  const sizeOptions = {
    'women': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'men': ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'kids': ['XS', 'S', 'M', 'L', 'XL', '2T', '3T', '4T']
  };
  
  return sizeOptions[category] || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
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
