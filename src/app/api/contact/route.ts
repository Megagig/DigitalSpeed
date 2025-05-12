import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  projectId: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactSchema.parse(body);
    
    // Create a new contact in the database
    const contact = await prisma.contact.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
        projectId: validatedData.projectId,
        isRead: false,
      },
    });
    
    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
