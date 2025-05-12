'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheck, FiX, FiEye, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface CommentActionButtonsProps {
  commentId: string;
  isApproved: boolean;
}

export default function CommentActionButtons({ 
  commentId, 
  isApproved 
}: CommentActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleApproveReject = async (approve: boolean) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/comments/${commentId}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: approve }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment status');
      }

      addToast({
        title: approve ? 'Comment Approved' : 'Comment Rejected',
        description: approve 
          ? 'The comment has been approved and is now visible.' 
          : 'The comment has been rejected.',
        type: 'success',
      });

      router.refresh();
    } catch (error) {
      console.error('Error updating comment:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update comment status.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      addToast({
        title: 'Comment Deleted',
        description: 'The comment has been permanently deleted.',
        type: 'success',
      });

      router.refresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
      addToast({
        title: 'Error',
        description: 'Failed to delete comment.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {!isApproved && (
        <Button
          variant="ghost"
          size="sm"
          icon={FiCheck}
          onClick={() => handleApproveReject(true)}
          disabled={isLoading}
          className="text-green-600 hover:text-green-800"
          title="Approve comment"
        />
      )}
      {isApproved && (
        <Button
          variant="ghost"
          size="sm"
          icon={FiX}
          onClick={() => handleApproveReject(false)}
          disabled={isLoading}
          className="text-yellow-600 hover:text-yellow-800"
          title="Reject comment"
        />
      )}
      <Button
        variant="ghost"
        size="sm"
        icon={FiTrash2}
        onClick={handleDelete}
        disabled={isLoading}
        className="text-red-600 hover:text-red-800"
        title="Delete comment"
      />
    </div>
  );
}
