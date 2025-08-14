import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, name } = await request.json();

    // Validate required fields (support both name and firstName/lastName)
    if (!email || !password || (!name && (!firstName || !lastName))) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (handle both name formats)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || name || 'User',
        lastName: lastName || ''
      }
    });

    // Send welcome email (don't block signup if email fails)
    try {
      await sendWelcomeEmail(user.email, user.firstName, user.lastName);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with successful signup even if email fails
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}