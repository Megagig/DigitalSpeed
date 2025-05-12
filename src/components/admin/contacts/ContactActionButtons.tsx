'use client';

import Link from 'next/link';
import { FiEye } from 'react-icons/fi';
import DeleteContactButton from '@/components/admin/contacts/DeleteContactButton';

interface ContactActionButtonsProps {
  contactId: string;
}

export default function ContactActionButtons({ contactId }: ContactActionButtonsProps) {
  return (
    <div className="flex items-center space-x-3">
      <Link
        href={`/dashboard/contacts/${contactId}`}
        className="text-blue-600 hover:text-blue-900"
      >
        <FiEye size={18} />
      </Link>
      <DeleteContactButton contactId={contactId} />
    </div>
  );
}
