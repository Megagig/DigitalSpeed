'use client';

import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface DeleteBlogButtonProps {
  blogId: string;
}

export default function DeleteBlogButton({ blogId }: DeleteBlogButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      addToast({
        type: 'success',
        title: 'Success',
        message: 'Blog post has been deleted successfully.',
      });

      router.refresh();
    } catch (error) {
      console.error('Error deleting blog:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete blog. Please try again.',
      });
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        icon={FiTrash2}
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirmation(true);
        }}
        className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
        aria-label="Delete blog"
      />

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => !isDeleting && setShowConfirmation(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this blog post? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
}
