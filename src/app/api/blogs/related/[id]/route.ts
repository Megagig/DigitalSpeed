import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the current blog to find its category and tags
    const currentBlog = await prisma.blog.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!currentBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Get related blogs based on category and tags
    const relatedBlogs = await prisma.blog.findMany({
      where: {
        id: { not: id },
        published: true,
        OR: [
          { categoryId: currentBlog.categoryId },
          {
            tags: {
              some: {
                id: { in: currentBlog.tags.map(tag => tag.id) }
              }
            }
          }
        ]
      },
      include: {
        category: true,
        tags: true,
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, blogs: relatedBlogs });
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related blogs' },
      { status: 500 }
    );
  }
}
