const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create a simple favicon
const size = 32;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#3b82f6'; // Blue background
ctx.fillRect(0, 0, size, size);

// Letter G
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 24px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('G', size / 2, size / 2);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), buffer);
console.log('Favicon created successfully!');
