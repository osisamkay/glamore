import { featuredProducts } from './src/data/products.js';

console.log('=== PRODUCT DATA ANALYSIS ===');
console.log(`Women products: ${featuredProducts.women.length}`);
console.log(`Men products: ${featuredProducts.men.length}`);
console.log(`Kids products: ${featuredProducts.kids.length}`);
console.log(`Total products: ${featuredProducts.women.length + featuredProducts.men.length + featuredProducts.kids.length}`);

console.log('\n=== MEN\'S PRODUCTS ===');
featuredProducts.men.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} (ID: ${product.id}, Category: ${product.category})`);
});

console.log('\n=== CHECKING FOR ISSUES ===');
const allProducts = [
  ...featuredProducts.women,
  ...featuredProducts.men,
  ...featuredProducts.kids
];

// Check for duplicate IDs
const ids = allProducts.map(p => p.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  console.log('⚠️  Duplicate IDs found:', duplicateIds);
} else {
  console.log('✅ No duplicate IDs');
}

// Check for missing required fields
const missingFields = allProducts.filter(p => !p.name || !p.category || !p.price);
if (missingFields.length > 0) {
  console.log('⚠️  Products with missing fields:', missingFields.length);
} else {
  console.log('✅ All products have required fields');
}
