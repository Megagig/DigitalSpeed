'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { FiUploadCloud, FiFile, FiX, FiImage, FiAlertCircle } from 'react-icons/fi';

interface FileUploadProps {
  onChange: (files: File[]) => void;
  value?: File[];
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  error?: string;
  preview?: boolean;
  previewUrls?: string[];
  onRemove?: (index: number) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export default function FileUpload({
  onChange,
  value = [],
  multiple = false,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  className,
  error,
  preview = true,
  previewUrls = [],
  onRemove,
  disabled = false,
  label = 'Upload files',
  helperText,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndProcessFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files) {
      validateAndProcessFiles(Array.from(e.dataTransfer.files));
    }
  };

  const validateAndProcessFiles = (files: File[]) => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    files.forEach(file => {
      // Check file type
      if (accept !== '*' && !file.type.match(accept.replace(/\*/g, '.*'))) {
        errors.push(`${file.name}: Invalid file type`);
        return;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds ${maxSize}MB`);
        return;
      }

      validFiles.push(file);
    });

    setFileErrors(errors);

    if (validFiles.length > 0) {
      if (multiple) {
        onChange([...value, ...validFiles]);
      } else {
        onChange(validFiles);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    if (onRemove) {
      onRemove(index);
    } else {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange(newFiles);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isImage = (file: File) => {
    return file.type.startsWith('image/');
  };

  return (
    <div className={className}>
      {label && (
        <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </p>
      )}
      
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 transition-colors',
          isDragging
            ? 'border-primary dark:border-primary-light bg-primary/5 dark:bg-primary-light/5'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          disabled && 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800',
          error && 'border-red-500 dark:border-red-500'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center py-4">
          <FiUploadCloud className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Drag and drop files here, or click to browse
          </p>
          {helperText && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {helperText}
            </p>
          )}
        </div>
      </div>

      {/* Error messages */}
      {(error || fileErrors.length > 0) && (
        <div className="mt-2">
          {error && (
            <div className="text-sm text-red-500 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
          {fileErrors.map((err, i) => (
            <div key={i} className="text-sm text-red-500 flex items-center mt-1">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* File previews */}
      {preview && (value.length > 0 || previewUrls.length > 0) && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((file, index) => (
            <div key={`file-${index}`} className="relative group">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-square flex items-center justify-center">
                {isImage(file) ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-4">
                    <FiFile className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center truncate max-w-full">
                      {file.name}
                    </p>
                  </div>
                )}
              </div>
              {!disabled && (
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          {previewUrls.map((url, index) => (
            <div key={`preview-${index}`} className="relative group">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-square flex items-center justify-center">
                {url.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={url}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-4">
                    <FiFile className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center truncate max-w-full">
                      File {index + 1}
                    </p>
                  </div>
                )}
              </div>
              {!disabled && onRemove && (
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
