import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(1, 'Review content is required'),
  authorName: z.string().min(1, 'Name is required'),
  authorEmail: z.string().email('Valid email is required'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before destructuring
    const { id } = await params;

    const reviews = await prisma.review.findMany({
      where: {
        productId: id,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        productId: params.id,
        // Auto-approve reviews for now, in a real app you might want to moderate them
        isApproved: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
