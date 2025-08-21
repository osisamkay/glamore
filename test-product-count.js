import { featuredProducts } from './src/data/products.js';

console.log('Women products:', featuredProducts.women.length);
console.log('Men products:', featuredProducts.men.length);
console.log('Kids products:', featuredProducts.kids.length);
console.log('Total products:', featuredProducts.women.length + featuredProducts.men.length + featuredProducts.kids.length);

console.log('\nFirst few women products:');
featuredProducts.women.slice(0, 5).forEach(p => console.log(`- ${p.name}`));

console.log('\nFirst few men products:');
featuredProducts.men.slice(0, 5).forEach(p => console.log(`- ${p.name}`));

console.log('\nFirst few kids products:');
featuredProducts.kids.slice(0, 5).forEach(p => console.log(`- ${p.name}`));
