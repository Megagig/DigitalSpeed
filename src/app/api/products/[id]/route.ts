import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  published: z.boolean().default(false),
  images: z.array(z.string()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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
    const validatedData = productSchema.parse(body);
    const { images, ...productData } = validatedData;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique (if changed)
    if (
      validatedData.slug !== existingProduct.slug &&
      await prisma.product.findUnique({
        where: {
          slug: validatedData.slug,
        },
      })
    ) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Update product
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Delete existing images
      await tx.productImage.deleteMany({
        where: {
          productId: params.id,
        },
      });

      // Update product and create new images
      return tx.product.update({
        where: {
          id: params.id,
        },
        data: {
          ...productData,
          images: {
            create: images?.map(url => ({ url })) || [],
          },
        },
        include: {
          images: true,
        },
      });
    });

    // Create audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'UPDATE_PRODUCT',
        details: `Updated product: ${updatedProduct.name}`,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update product' },
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product (cascade will delete images)
    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    // Create audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'DELETE_PRODUCT',
        details: `Deleted product: ${product.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
