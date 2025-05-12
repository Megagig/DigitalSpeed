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

    const { id } = params;

    // Delete the contact
    await prisma.contact.delete({
      where: { id },
    });

    // Log the action in the audit trail
    await prisma.auditTrail.create({
      data: {
        userId: user.id,
        action: 'DELETE_CONTACT',
        details: `Deleted contact with ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}

export async function GET(
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

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Mark as read if it's not already
    if (!contact.isRead) {
      await prisma.contact.update({
        where: { id },
        data: { isRead: true },
      });

      // Log the action in the audit trail
      await prisma.auditTrail.create({
        data: {
          userId: user.id,
          action: 'MARK_CONTACT_READ',
          details: `Marked contact with ID: ${id} as read`,
        },
      });
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}
