import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = blogSchema.parse(body);
    
    // Check if slug is already in use
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: validatedData.slug },
    });
    
    if (existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Slug is already in use' },
        { status: 400 }
      );
    }
    
    // Create the blog
    const blog = await prisma.blog.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        featuredImage: validatedData.featuredImage,
        published: validatedData.published,
        categoryId: validatedData.categoryId || null,
      },
    });
    
    // Connect tags if provided
    if (validatedData.tags && validatedData.tags.length > 0) {
      await prisma.blog.update({
        where: { id: blog.id },
        data: {
          tags: {
            connect: validatedData.tags.map((tagId) => ({ id: tagId })),
          },
        },
      });
    }
    
    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'CREATE_BLOG',
        details: `Created blog with ID: ${blog.id}`,
      },
    });
    
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        tags: true,
      },
    });
    
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
