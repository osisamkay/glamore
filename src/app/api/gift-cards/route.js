import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validate gift card and get balance
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Gift card code is required' },
        { status: 400 }
      );
    }

    const giftCard = await prisma.giftCard.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!giftCard) {
      return NextResponse.json(
        { success: false, error: 'Invalid gift card code' },
        { status: 404 }
      );
    }

    if (!giftCard.isActive) {
      return NextResponse.json(
        { success: false, error: 'Gift card is no longer active' },
        { status: 400 }
      );
    }

    if (giftCard.expiresAt && new Date() > giftCard.expiresAt) {
      return NextResponse.json(
        { success: false, error: 'Gift card has expired' },
        { status: 400 }
      );
    }

    if (giftCard.balance <= 0) {
      return NextResponse.json(
        { success: false, error: 'Gift card has no remaining balance' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      giftCard: {
        code: giftCard.code,
        balance: giftCard.balance,
        expiresAt: giftCard.expiresAt
      }
    });

  } catch (error) {
    console.error('Error validating gift card:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate gift card' },
      { status: 500 }
    );
  }
}

// Apply gift card to order (deduct balance)
export async function POST(request) {
  try {
    const { code, amount } = await request.json();
    
    if (!code || !amount) {
      return NextResponse.json(
        { success: false, error: 'Gift card code and amount are required' },
        { status: 400 }
      );
    }

    const giftCard = await prisma.giftCard.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!giftCard || !giftCard.isActive || giftCard.balance < amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid gift card or insufficient balance' },
        { status: 400 }
      );
    }

    // Deduct the amount from gift card balance
    const updatedGiftCard = await prisma.giftCard.update({
      where: { code: code.toUpperCase() },
      data: { 
        balance: giftCard.balance - amount,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      appliedAmount: amount,
      remainingBalance: updatedGiftCard.balance
    });

  } catch (error) {
    console.error('Error applying gift card:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to apply gift card' },
      { status: 500 }
    );
  }
}

// Create gift card (for admin/testing)
export async function PUT(request) {
  try {
    const { code, balance, expiresAt } = await request.json();
    
    if (!code || !balance) {
      return NextResponse.json(
        { success: false, error: 'Code and balance are required' },
        { status: 400 }
      );
    }

    const giftCard = await prisma.giftCard.create({
      data: {
        code: code.toUpperCase(),
        balance: parseFloat(balance),
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return NextResponse.json({
      success: true,
      giftCard: {
        code: giftCard.code,
        balance: giftCard.balance,
        expiresAt: giftCard.expiresAt
      }
    });

  } catch (error) {
    console.error('Error creating gift card:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gift card' },
      { status: 500 }
    );
  }
}
