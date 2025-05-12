import Link from 'next/link';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import { FiMail, FiPhone, FiCalendar, FiBriefcase } from 'react-icons/fi';
import ContactDetailActions from '@/components/admin/contacts/ContactDetailActions';
import { PageProps } from 'next';

type ContactDetailPageProps = {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
};

async function getContact(id: string) {
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      project: true,
    },
  });

  if (!contact) {
    notFound();
  }

  // Mark as read if it's not already
  if (!contact.isRead) {
    await prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });
  }

  return contact;
}

export default async function ContactDetailPage({
  params,
}: ContactDetailPageProps) {
  const contact = await getContact(params.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contact Details</h1>
        <ContactDetailActions contactId={contact.id} />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {contact.firstName} {contact.lastName || ''}
              </h2>
              <div className="flex items-center mt-2 text-gray-500">
                <FiMail size={16} className="mr-2" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-blue-600"
                >
                  {contact.email}
                </a>
              </div>
              {contact.phone && (
                <div className="flex items-center mt-2 text-gray-500">
                  <FiPhone size={16} className="mr-2" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="hover:text-blue-600"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex items-center text-gray-500">
                <FiCalendar size={16} className="mr-2" />
                <span>{formatDateTime(contact.createdAt)}</span>
              </div>
              {contact.project && (
                <div className="flex items-center mt-2 text-gray-500">
                  <FiBriefcase size={16} className="mr-2" />
                  <Link
                    href={`/dashboard/projects/${contact.project.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contact.project.title}
                  </Link>
                </div>
              )}
              <div className="mt-2">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    contact.isRead
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {contact.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Message</h3>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
