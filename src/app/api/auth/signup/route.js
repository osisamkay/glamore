import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';

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

    const sql = neon(process.env.DATABASE_URL);
    
    // Check if user already exists
    const existingUserResult = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `;
    
    const existingUser = existingUserResult[0];

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (handle both name formats)
    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'User';
    const userResult = await sql`
      INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${email}, ${hashedPassword}, ${fullName}, 'user', NOW(), NOW())
      RETURNING *
    `;
    
    const user = userResult[0];

    // Send welcome email (don't block signup if email fails)
    try {
      await sendWelcomeEmail(user.email, user.name, '');
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