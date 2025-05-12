'use client';

import { FiMessageSquare } from 'react-icons/fi';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <FiMessageSquare className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No comments found
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        Comments will appear here once users start engaging with your blog posts
      </p>
    </div>
  );
}
