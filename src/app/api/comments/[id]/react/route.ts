import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const reactionSchema = z.object({
  emoji: z.string().min(1, 'Emoji is required'),
  userName: z.string().min(1, 'User name is required'),
  userId: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before destructuring
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = reactionSchema.parse(body);

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

    // Create a new reaction
    const reaction = await prisma.commentReaction.create({
      data: {
        emoji: validatedData.emoji,
        userName: validatedData.userName,
        userId: validatedData.userId,
        commentId: id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      reaction 
    });
  } catch (error) {
    console.error('Error adding reaction to comment:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to add reaction' },
      { status: 500 }
    );
  }
}
