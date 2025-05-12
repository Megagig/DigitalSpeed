'use client';

import Button from '@/components/ui/Button';
import { FiPlus } from 'react-icons/fi';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No blogs found
      </p>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Get started by creating a new blog post
      </p>
      <Button
        variant="primary"
        size="sm"
        icon={FiPlus}
        href="/dashboard/blogs/new"
      >
        Add New Blog
      </Button>
    </div>
  );
}
