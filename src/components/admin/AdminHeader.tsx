'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiSun,
  FiMoon,
  FiSearch,
  FiChevronRight,
} from 'react-icons/fi';
import { SessionUser } from '@/types';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  user: SessionUser;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileOpen && !target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
      if (isNotificationsOpen && !target.closest('.notifications-dropdown')) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, isNotificationsOpen]);

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);

    return (
      <div className="flex items-center text-sm">
        <Link
          href="/dashboard"
          className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
        >
          Dashboard
        </Link>

        {paths.length > 1 &&
          paths.slice(1).map((path, index) => {
            const href = `/dashboard/${paths.slice(1, index + 2).join('/')}`;
            const isLast = index === paths.length - 2;

            return (
              <div key={path} className="flex items-center">
                <FiChevronRight className="mx-2 text-gray-400" size={14} />
                {isLast ? (
                  <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                    {path.replace(/-/g, ' ')}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light capitalize"
                  >
                    {path.replace(/-/g, ' ')}
                  </Link>
                )}
              </div>
            );
          })}
      </div>
    );
  };

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'New contact form submission',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Product "Digital Camera" is low in stock',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'New comment on blog post',
      time: '3 hours ago',
      read: true,
    },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-6 transition-colors duration-300">
      <div className="flex items-center">
        {/* Breadcrumbs - hidden on mobile */}
        <div className="hidden md:block">{generateBreadcrumbs()}</div>

        {/* Mobile title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 md:hidden">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search button */}
        <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <FiSearch className="w-5 h-5" />
        </button>

        {/* Theme toggle */}
        <button
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() =>
            mounted && setTheme(theme === 'dark' ? 'light' : 'dark')
          }
          aria-label="Toggle theme"
        >
          {mounted && theme === 'dark' ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative notifications-dropdown">
          <button
            className={cn(
              'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative',
              notifications.some((n) => !n.read) &&
                'after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:bg-red-500 after:rounded-full'
            )}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  Notifications
                </h3>
                <Link
                  href="/dashboard/notifications"
                  className="text-xs text-primary dark:text-primary-light hover:underline"
                  onClick={() => setIsNotificationsOpen(false)}
                >
                  View all
                </Link>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-2 border-transparent',
                        !notification.read &&
                          'border-l-2 border-primary dark:border-primary-light bg-blue-50 dark:bg-blue-900/20'
                      )}
                    >
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative profile-dropdown">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
              {user.name || user.email}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {user.email}
                </p>
              </div>
              <Link
                href="/dashboard/settings/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsProfileOpen(false)}
              >
                <FiSettings className="w-4 h-4 mr-2" />
                Profile Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
