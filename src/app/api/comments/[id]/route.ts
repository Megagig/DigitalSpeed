import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
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

    // Delete the comment
    await prisma.comment.delete({
      where: { id },
    });

    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'DELETE_COMMENT',
        details: `Deleted comment with ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before destructuring
    const { id } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        blog: true,
        parent: true,
        replies: {
          where: {
            isApproved: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        reactions: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comment' },
      { status: 500 }
    );
  }
}
