import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before destructuring
    const { id } = await params;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Increment the likes count
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      likes: updatedComment.likes 
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}
