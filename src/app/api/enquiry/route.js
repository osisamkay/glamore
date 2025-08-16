import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { fullName, email, subject, orderNumber, description } = await request.json();

    // Validate required fields
    if (!fullName || !email || !subject || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create enquiry record
    const enquiry = await prisma.enquiry.create({
      data: {
        fullName,
        email,
        subject,
        orderNumber: orderNumber || null,
        description,
        status: 'pending',
        createdAt: new Date()
      }
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to customer

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      enquiry: {
        id: enquiry.id,
        status: enquiry.status
      }
    });

  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
