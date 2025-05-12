'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';
import Link from 'next/link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  href?: string;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      href,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-light focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed',
      fullWidth && 'w-full',
      {
        // Size variations
        'text-xs px-2.5 py-1.5': size === 'sm',
        'text-sm px-4 py-2': size === 'md',
        'text-base px-5 py-2.5': size === 'lg',

        // Variant variations
        'bg-primary hover:bg-primary-dark text-white': variant === 'primary',
        'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200': variant === 'secondary',
        'bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300': variant === 'outline',
        'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300': variant === 'ghost',
        'bg-red-600 hover:bg-red-700 text-white': variant === 'danger',
        'bg-green-600 hover:bg-green-700 text-white': variant === 'success',
      },
      className
    );

    const content = (
      <>
        {isLoading && (
          <svg
            className={cn('animate-spin -ml-1 mr-2 h-4 w-4 text-current', {
              'mr-2': iconPosition === 'left' && children,
              'ml-2 mr-0 order-2': iconPosition === 'right' && children,
              'mr-0': !children,
            })}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {Icon && !isLoading && iconPosition === 'left' && (
          <Icon
            className={cn('h-5 w-5', {
              'mr-2': children,
            })}
            aria-hidden="true"
          />
        )}
        {children}
        {Icon && !isLoading && iconPosition === 'right' && (
          <Icon
            className={cn('h-5 w-5', {
              'ml-2': children,
            })}
            aria-hidden="true"
          />
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(baseStyles, disabled && 'pointer-events-none')}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={baseStyles}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
