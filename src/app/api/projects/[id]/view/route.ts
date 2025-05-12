import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Increment the likes count (using likes as view count for now)
    const project = await prisma.project.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true, likes: project.likes });
  } catch (error) {
    console.error('Error incrementing project view count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}
