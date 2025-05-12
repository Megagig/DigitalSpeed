'use client';

import Link from 'next/link';
import { FiEdit } from 'react-icons/fi';
import DeleteProjectButton from '@/components/admin/projects/DeleteProjectButton';

interface ProjectActionButtonsProps {
  projectId: string;
}

export default function ProjectActionButtons({ projectId }: ProjectActionButtonsProps) {
  return (
    <div className="flex items-center space-x-3">
      <Link
        href={`/dashboard/projects/${projectId}`}
        className="text-blue-600 hover:text-blue-900"
      >
        <FiEdit size={18} />
      </Link>
      <DeleteProjectButton projectId={projectId} />
    </div>
  );
}
