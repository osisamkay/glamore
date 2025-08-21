const https = require('https');

const options = {
  hostname: 'ggfashions.netlify.app',
  path: '/api/seed-all',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Starting database seeding...');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('Seeding completed successfully:');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
