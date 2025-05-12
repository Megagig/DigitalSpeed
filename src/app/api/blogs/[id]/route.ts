import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Delete the blog
    await prisma.blog.delete({
      where: { id },
    });

    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'DELETE_BLOG',
        details: `Deleted blog with ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Update the blog
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        featuredImage: body.featuredImage,
        published: body.published,
        categoryId: body.categoryId || null,
      },
    });

    // Update tags if provided
    if (body.tags && Array.isArray(body.tags)) {
      // First, remove all existing tag connections
      await prisma.blog.update({
        where: { id },
        data: {
          tags: {
            set: [],
          },
        },
      });

      // Then, connect the new tags
      await prisma.blog.update({
        where: { id },
        data: {
          tags: {
            connect: body.tags.map((tagId: string) => ({ id: tagId })),
          },
        },
      });
    }

    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'UPDATE_BLOG',
        details: `Updated blog with ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}
