import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const galleryItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Image is required'),
});

export async function GET(request: NextRequest) {
  try {
    const galleryItems = await prisma.gallery.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = galleryItemSchema.parse(body);

    // Create gallery item
    const galleryItem = await prisma.gallery.create({
      data: validatedData,
    });

    // Create audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'CREATE_GALLERY_ITEM',
        details: `Added new gallery item${validatedData.title ? `: ${validatedData.title}` : ''}`,
      },
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}
