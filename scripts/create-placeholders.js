const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Function to create a placeholder image
function createPlaceholderImage(filename, width, height, text, bgColor) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Created ${filename}`);
}

// Create hero image
createPlaceholderImage('hero-image.jpg', 1920, 600, 'Hero Image', '#3b82f6');

// Create category images
const categories = [
  { name: 'category-1.jpg', color: '#4f46e5' },
  { name: 'category-2.jpg', color: '#10b981' },
  { name: 'category-3.jpg', color: '#f59e0b' }
];

categories.forEach((category, index) => {
  createPlaceholderImage(category.name, 640, 480, `Category ${index + 1}`, category.color);
});

// Create product images
const products = [
  { name: 'product-1.jpg', color: '#ef4444' },
  { name: 'product-2.jpg', color: '#8b5cf6' },
  { name: 'product-3.jpg', color: '#ec4899' },
  { name: 'product-4.jpg', color: '#14b8a6' },
  { name: 'product-5.jpg', color: '#f97316' },
  { name: 'product-6.jpg', color: '#06b6d4' },
  { name: 'product-7.jpg', color: '#84cc16' },
  { name: 'product-8.jpg', color: '#6366f1' }
];

products.forEach((product, index) => {
  createPlaceholderImage(product.name, 640, 640, `Product ${index + 1}`, product.color);
});

console.log('All placeholder images created successfully!');
