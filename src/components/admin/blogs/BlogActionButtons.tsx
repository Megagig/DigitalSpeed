'use client';

import Button from '@/components/ui/Button';
import { FiEye, FiEdit } from 'react-icons/fi';
import DeleteBlogButton from '@/components/admin/blogs/DeleteBlogButton';

interface BlogActionButtonsProps {
  blogId: string;
  blogSlug: string;
}

export default function BlogActionButtons({ blogId, blogSlug }: BlogActionButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        icon={FiEye}
        href={`/blog/${blogSlug}`}
      />
      <Button
        variant="ghost"
        size="sm"
        icon={FiEdit}
        href={`/dashboard/blogs/${blogId}`}
      />
      <DeleteBlogButton blogId={blogId} />
    </div>
  );
}
