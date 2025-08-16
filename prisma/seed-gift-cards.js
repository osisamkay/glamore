const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedGiftCards() {
  try {
    console.log('🎁 Seeding gift cards...');

    // Create test gift cards
    const giftCards = [
      {
        code: 'GIFT50',
        balance: 50.00,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      },
      {
        code: 'GIFT100',
        balance: 100.00,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      },
      {
        code: 'GIFT25',
        balance: 25.00,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      },
      {
        code: 'WELCOME20',
        balance: 20.00,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        code: 'EXPIRED10',
        balance: 10.00,
        isActive: true,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Expired yesterday
      }
    ];

    for (const giftCard of giftCards) {
      try {
        await prisma.giftCard.upsert({
          where: { code: giftCard.code },
          update: giftCard,
          create: giftCard,
        });
      } catch (error) {
        // If upsert fails, try create directly
        try {
          await prisma.giftCard.create({
            data: giftCard
          });
        } catch (createError) {
          console.log(`Gift card ${giftCard.code} already exists or failed to create`);
        }
      }
    }

    console.log('✅ Gift cards seeded successfully!');
    console.log('Available test codes:');
    console.log('- GIFT50 ($50.00)');
    console.log('- GIFT100 ($100.00)');
    console.log('- GIFT25 ($25.00)');
    console.log('- WELCOME20 ($20.00)');
    console.log('- EXPIRED10 ($10.00 - expired for testing)');

  } catch (error) {
    console.error('Error seeding gift cards:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedGiftCards();
