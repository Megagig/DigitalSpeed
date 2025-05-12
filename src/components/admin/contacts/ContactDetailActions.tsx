'use client';

import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import DeleteContactButton from '@/components/admin/contacts/DeleteContactButton';

interface ContactDetailActionsProps {
  contactId: string;
}

export default function ContactDetailActions({ contactId }: ContactDetailActionsProps) {
  return (
    <div className="flex items-center space-x-3">
      <Link
        href="/dashboard/contacts"
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <FiArrowLeft size={16} className="mr-2" />
        Back to Contacts
      </Link>
      <DeleteContactButton contactId={contactId} />
    </div>
  );
}
