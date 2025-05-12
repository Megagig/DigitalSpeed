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

    // Await params before destructuring
    const { id } = await params;

    // Delete the project (cascade will delete images)
    await prisma.project.delete({
      where: { id },
    });

    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'DELETE_PROJECT',
        details: `Deleted project with ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before destructuring
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
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

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        published: body.published,
      },
    });

    // Update images if provided
    if (body.images && Array.isArray(body.images)) {
      // First, delete all existing images
      await prisma.projectImage.deleteMany({
        where: { projectId: id },
      });

      // Then, add the new images
      await Promise.all(
        body.images.map((imageUrl: string) =>
          prisma.projectImage.create({
            data: {
              url: imageUrl,
              projectId: id,
            },
          })
        )
      );
    }

    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'UPDATE_PROJECT',
        details: `Updated project with ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
