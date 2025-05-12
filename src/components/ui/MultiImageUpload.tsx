'use client';

import { useState, useRef } from 'react';
import { uploadMultipleImages } from '@/lib/cloudinary';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';
import Image from 'next/image';

interface MultiImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  currentImages?: string[];
  className?: string;
}

export default function MultiImageUpload({
  onImagesUploaded,
  currentImages = [],
  className = '',
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Create previews
    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);

    // Upload to Cloudinary
    try {
      setIsUploading(true);
      const results = await uploadMultipleImages(fileArray);
      const uploadedUrls = results.map(result => {
        if (result && 'secure_url' in result) {
          return result.secure_url;
        }
        return '';
      }).filter(url => url !== '');
      
      onImagesUploaded([...currentImages, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
    
    // Update parent component
    const currentUrls = currentImages.filter((_, i) => i !== index);
    onImagesUploaded(currentUrls);
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative group">
            <div className="relative h-32 w-full rounded-md overflow-hidden">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
        
        <div className="relative h-32 w-full">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="sr-only"
            ref={fileInputRef}
            disabled={isUploading}
          />
          <label
            htmlFor="images"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
          >
            <div className="flex flex-col items-center">
              {isUploading ? (
                <span className="text-sm text-gray-500">Uploading...</span>
              ) : (
                <>
                  <FiPlus className="h-8 w-8 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">Add Images</span>
                </>
              )}
            </div>
          </label>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        You can upload multiple images. Click on the + to add more.
      </p>
    </div>
  );
}
