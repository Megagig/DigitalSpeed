import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string()).optional(),
  published: z.boolean().default(false),
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
    const validatedData = projectSchema.parse(body);
    
    // Check if slug is already in use
    const existingProject = await prisma.project.findUnique({
      where: { slug: validatedData.slug },
    });
    
    if (existingProject) {
      return NextResponse.json(
        { success: false, error: 'Slug is already in use' },
        { status: 400 }
      );
    }
    
    // Create the project
    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        published: validatedData.published,
      },
    });
    
    // Add images if provided
    if (validatedData.images && validatedData.images.length > 0) {
      await Promise.all(
        validatedData.images.map((imageUrl) =>
          prisma.projectImage.create({
            data: {
              url: imageUrl,
              projectId: project.id,
            },
          })
        )
      );
    }
    
    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'CREATE_PROJECT',
        details: `Created project with ID: ${project.id}`,
      },
    });
    
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
      },
    });
    
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
