import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const galleryItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Image is required'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galleryItem = await prisma.gallery.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if gallery item exists
    const existingItem = await prisma.gallery.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    // Update gallery item
    const updatedItem = await prisma.gallery.update({
      where: {
        id: params.id,
      },
      data: validatedData,
    });

    // Create audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'UPDATE_GALLERY_ITEM',
        details: `Updated gallery item${updatedItem.title ? `: ${updatedItem.title}` : ''}`,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if gallery item exists
    const galleryItem = await prisma.gallery.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    // Delete gallery item
    await prisma.gallery.delete({
      where: {
        id: params.id,
      },
    });

    // Create audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'DELETE_GALLERY_ITEM',
        details: `Deleted gallery item${galleryItem.title ? `: ${galleryItem.title}` : ''}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
