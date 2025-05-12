import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  authorName: z.string().min(1, 'Name is required'),
  authorEmail: z.string().email('Valid email is required'),
  parentId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before destructuring
    const { id } = await params;

    const comments = await prisma.comment.findMany({
      where: {
        blogId: id,
        isApproved: true,
        parentId: null, // Only get top-level comments
      },
      include: {
        replies: {
          where: {
            isApproved: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
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
    const validatedData = commentSchema.parse(body);

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // If it's a reply, check if parent comment exists
    if (validatedData.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: {
          id: validatedData.parentId,
        },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        blogId: params.id,
        // Comments need to be approved by an admin before they appear
        isApproved: false,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
