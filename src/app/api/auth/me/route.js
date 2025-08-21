import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';


export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || 
                  cookieStore.get('admin_token')?.value || 
                  cookieStore.get('cs_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const sql = neon(process.env.DATABASE_URL);

    // Find user by ID
    const users = await sql`
      SELECT id, email, name, role, "createdAt", "updatedAt"
      FROM "User" 
      WHERE id = ${userId}
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}