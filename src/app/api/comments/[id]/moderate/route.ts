import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const moderateSchema = z.object({
  isApproved: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
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

    // Await params before destructuring
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = moderateSchema.parse(body);

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

    // Update comment approval status
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        isApproved: validatedData.isApproved,
      },
    });

    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: validatedData.isApproved ? 'APPROVE_COMMENT' : 'REJECT_COMMENT',
        details: `${validatedData.isApproved ? 'Approved' : 'Rejected'} comment with ID: ${id}`,
      },
    });

    return NextResponse.json({ 
      success: true, 
      comment: updatedComment 
    });
  } catch (error) {
    console.error('Error moderating comment:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to moderate comment' },
      { status: 500 }
    );
  }
}
