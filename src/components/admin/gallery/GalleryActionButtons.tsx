'use client';

import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GalleryActionButtonsProps {
  galleryItemId: string;
}

export default function GalleryActionButtons({ galleryItemId }: GalleryActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isDeleting) return;
    
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/gallery/${galleryItemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gallery item');
      }
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
        title="Edit details"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/dashboard/gallery/${galleryItemId}`);
        }}
      >
        <FiEdit2 size={18} />
      </button>
      <button
        className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
        title="Delete image"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        disabled={isDeleting}
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}
