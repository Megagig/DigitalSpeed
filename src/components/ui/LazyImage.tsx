'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  blur?: boolean;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  objectFit = 'cover',
  blur = true,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setImgSrc(src);
  }, [src]);

  useEffect(() => {
    // Use Intersection Observer to detect when the image is in view
    if (
      !priority &&
      typeof window !== 'undefined' &&
      'IntersectionObserver' in window
    ) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '200px' } // Load images when they're 200px from viewport
      );

      const element = document.getElementById(
        `lazy-img-${src.replace(/[^a-zA-Z0-9]/g, '')}`
      );
      if (element) {
        observer.observe(element);
      }

      return () => {
        observer.disconnect();
      };
    } else {
      // If priority is true or IntersectionObserver is not supported, load immediately
      setIsInView(true);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // If image fails to load, use a placeholder
    // Use a different placeholder based on the context
    if (src.includes('blog')) {
      setImgSrc('/images/placeholders/blog-placeholder.jpg');
    } else if (src.includes('project')) {
      setImgSrc('/images/placeholders/project-placeholder.jpg');
    } else if (src.includes('product')) {
      setImgSrc('/images/placeholders/product-placeholder.jpg');
    } else if (src.includes('skills')) {
      setImgSrc('/images/placeholders/skill-placeholder.jpg');
    } else {
      setImgSrc('/images/placeholders/image-placeholder.jpg');
    }
  };

  return (
    <div
      id={`lazy-img-${src.replace(/[^a-zA-Z0-9]/g, '')}`}
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {(isInView || priority) && (
        <>
          {blur && !isLoaded && (
            <div
              className="absolute inset-0 bg-gray-200 animate-pulse"
              style={{ width, height }}
            />
          )}
          <Image
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectFit }}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
          />
        </>
      )}
    </div>
  );
}
