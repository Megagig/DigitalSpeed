'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: {
    label: string;
    href: string;
  }[];
}

export default function PageTitle({
  title,
  description,
  actions,
  breadcrumbs,
}: PageTitleProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
              >
                <FiHome className="mr-2 w-4 h-4" />
                Dashboard
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href}>
                <div className="flex items-center">
                  <FiChevronRight className="w-4 h-4 text-gray-400" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="ml-1 md:ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="ml-1 md:ml-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title and actions */}
      <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", 
        description ? "mb-2" : "")}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
