'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  objectFit = 'cover',
}: CloudinaryImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Check if the image is already a Cloudinary URL
    if (src.includes('cloudinary.com')) {
      setImageUrl(src);
      return;
    }

    // Check if the image is a public URL
    if (src.startsWith('http')) {
      setImageUrl(src);
      return;
    }

    // If it's a Cloudinary public ID
    if (src.includes('/')) {
      const image = cld.image(src);
      image.resize(fill().width(width).height(height));
      image.delivery(format(auto()));
      image.delivery(quality(autoQuality()));
      setImageUrl(image.toURL());
    } else {
      // If it's a local image
      setImageUrl(src);
    }
  }, [src, width, height]);

  if (!imageUrl) {
    return <div className={`bg-gray-200 ${className}`} style={{ width, height }} />;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={{ objectFit }}
    />
  );
}
