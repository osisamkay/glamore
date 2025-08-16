import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { reviews } = await request.json();

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is delivered (can only review delivered orders)
    if (order.status !== 'delivered') {
      return NextResponse.json(
        { success: false, error: 'Can only review delivered orders' },
        { status: 400 }
      );
    }

    // Create reviews for each item
    const createdReviews = [];
    for (const [itemId, reviewData] of Object.entries(reviews)) {
      const orderItem = order.items.find(item => item.id === itemId);
      if (!orderItem) continue;

      // Check if review already exists
      const existingReview = await prisma.review.findFirst({
        where: {
          productId: orderItem.productId,
          orderId: id,
          orderItemId: itemId
        }
      });

      if (existingReview) {
        // Update existing review
        const updatedReview = await prisma.review.update({
          where: { id: existingReview.id },
          data: {
            rating: reviewData.rating,
            comment: reviewData.comment || null,
            updatedAt: new Date()
          }
        });
        createdReviews.push(updatedReview);
      } else {
        // Create new review
        const newReview = await prisma.review.create({
          data: {
            productId: orderItem.productId,
            orderId: id,
            orderItemId: itemId,
            rating: reviewData.rating,
            comment: reviewData.comment || null,
            // TODO: Add userId when user authentication is implemented
            customerName: 'Anonymous', // Placeholder
          }
        });
        createdReviews.push(newReview);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reviews submitted successfully',
      reviews: createdReviews
    });

  } catch (error) {
    console.error('Error submitting reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit reviews' },
      { status: 500 }
    );
  }
}
