'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export default function ImageUpload({
  onImageUploaded,
  currentImage,
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary via API route
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'digitalspeed');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();

      if (result && result.secure_url) {
        onImageUploaded(result.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        disabled={isUploading}
      />

      {previewUrl ? (
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            disabled={isUploading}
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 md:h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-500 transition-colors"
          disabled={isUploading}
        >
          <FiUpload size={32} className="mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Click to upload an image'}
          </p>
        </button>
      )}
    </div>
  );
}
