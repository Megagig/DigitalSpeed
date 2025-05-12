'use client';

import { useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider {...props}>
      <div className={mounted ? 'theme-transition' : 'opacity-0'}>
        {children}
      </div>
    </NextThemesProvider>
  );
}

// Theme toggle button component
interface ThemeToggleProps {
  className?: string;
  iconClassName?: string;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({
  className = '',
  iconClassName = '',
  variant = 'icon',
  size = 'md',
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSize = sizeClasses[size];

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center justify-center px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-hover transition-colors ${className}`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <>
            <SunIcon
              className={`${iconSize} theme-toggle-icon ${iconClassName}`}
            />
            <span className="ml-2">Light Mode</span>
          </>
        ) : (
          <>
            <MoonIcon
              className={`${iconSize} theme-toggle-icon ${iconClassName}`}
            />
            <span className="ml-2">Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary-hover transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className={`${iconSize} theme-toggle-icon ${iconClassName}`} />
      ) : (
        <MoonIcon
          className={`${iconSize} theme-toggle-icon ${iconClassName}`}
        />
      )}
    </button>
  );
}

// Sun icon component
function SunIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Moon icon component
function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// We already imported useTheme at the top, so no need to re-export it
// export { useTheme } from 'next-themes';
