'use client';

import { lazy, Suspense, ComponentType } from 'react';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  ssr?: boolean;
}

/**
 * Utility function to lazy load components with a fallback
 * @param importFn - Dynamic import function
 * @param options - Options for lazy loading
 * @returns Lazy loaded component with suspense
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = lazy(importFn);
  const { fallback = null, ssr = false } = options;

  // Return a component that renders the lazy component in a suspense boundary
  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    // If SSR is disabled and we're on the server, return the fallback
    if (!ssr && typeof window === 'undefined') {
      return <>{fallback}</>;
    }

    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
