'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleStop = () => {
      setIsLoading(false);
    };

    // Add event listeners for route change start and complete
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleStop);

    // Clean up event listeners
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleStop);
    };
  }, []);

  // Reset loading state when the route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 z-[9999] transition-all duration-300',
        isLoading ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="h-full w-full animate-loading-bar" />
    </div>
  );
}
