'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  FiLayout,
  FiFileText,
  FiBriefcase,
  FiShoppingBag,
  FiImage,
  FiMessageSquare,
  FiSettings,
  FiClock,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: IconType;
  submenu?: {
    title: string;
    href: string;
  }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: FiLayout,
  },
  {
    title: 'Blogs',
    href: '/dashboard/blogs',
    icon: FiFileText,
    submenu: [
      {
        title: 'All Blogs',
        href: '/dashboard/blogs',
      },
      {
        title: 'Add New',
        href: '/dashboard/blogs/new',
      },
      {
        title: 'Categories',
        href: '/dashboard/blogs/categories',
      },
      {
        title: 'Tags',
        href: '/dashboard/blogs/tags',
      },
    ],
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FiBriefcase,
    submenu: [
      {
        title: 'All Projects',
        href: '/dashboard/projects',
      },
      {
        title: 'Add New',
        href: '/dashboard/projects/new',
      },
    ],
  },
  {
    title: 'Shop',
    href: '/dashboard/shop',
    icon: FiShoppingBag,
    submenu: [
      {
        title: 'All Products',
        href: '/dashboard/shop',
      },
      {
        title: 'Add New',
        href: '/dashboard/shop/new',
      },
      {
        title: 'Orders',
        href: '/dashboard/shop/orders',
      },
    ],
  },
  {
    title: 'Gallery',
    href: '/dashboard/gallery',
    icon: FiImage,
    submenu: [
      {
        title: 'All Images',
        href: '/dashboard/gallery',
      },
      {
        title: 'Add New',
        href: '/dashboard/gallery/new',
      },
      {
        title: 'Albums',
        href: '/dashboard/gallery/albums',
      },
    ],
  },
  {
    title: 'Contacts',
    href: '/dashboard/contacts',
    icon: FiMessageSquare,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: FiSettings,
  },
  {
    title: 'Audit Trail',
    href: '/dashboard/audit-trail',
    icon: FiClock,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // Toggle submenu open/closed state
  const toggleSubmenu = (title: string) => {
    if (isCollapsed) return;
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Check if the current path is active or a subpath
  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Check if any submenu item is active
  const hasActiveSubmenu = (item: NavItem) => {
    if (!item.submenu) return false;
    return item.submenu.some((subItem) => isActiveLink(subItem.href));
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-white p-2 rounded-md shadow-md hover:bg-primary-hover transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FiX size={24} className="animate-fade-in" />
        ) : (
          <FiMenu size={24} className="animate-fade-in" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 shadow-lg transform transition-all duration-300 ease-in-out md:translate-x-0',
          'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
          isOpen ? 'translate-x-0 animate-slide-in' : '-translate-x-full',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-4">
            {!isCollapsed ? (
              <Link href="/" className="flex items-center group">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 dark:from-primary-light dark:to-blue-400 bg-clip-text text-transparent transition-all duration-300 animate-fade-in group-hover:scale-105">
                  DigitalSpeed
                </span>
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center justify-center w-full transition-transform duration-300 hover:scale-110"
              >
                <FiHome className="w-6 h-6 text-primary dark:text-primary-light animate-fade-in" />
              </Link>
            )}

            {/* Collapse button - visible only on desktop */}
            <button
              className="hidden md:flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <FiChevronRight size={18} className="animate-pulse-slow" />
              ) : (
                <FiChevronLeft size={18} className="animate-pulse-slow" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className={cn('relative', isCollapsed && 'group')}
                >
                  {/* Main menu item */}
                  {item.submenu ? (
                    <button
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 rounded-md transition-all duration-300',
                        isActiveLink(item.href) ||
                          hasActiveSubmenu(item) ||
                          openSubmenus[item.title]
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm',
                        isCollapsed && 'justify-center'
                      )}
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={cn('w-5 h-5', isCollapsed ? '' : 'mr-3')}
                        />
                        {!isCollapsed && <span>{item.title}</span>}
                        {isCollapsed && (
                          <span className="sr-only">{item.title}</span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <FiChevronRight
                          className={cn(
                            'w-4 h-4 transition-transform',
                            openSubmenus[item.title] && 'transform rotate-90'
                          )}
                        />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-4 py-3 rounded-md transition-all duration-300',
                        isActiveLink(item.href)
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm',
                        isCollapsed && 'justify-center'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon
                        className={cn('w-5 h-5', isCollapsed ? '' : 'mr-3')}
                      />
                      {!isCollapsed && <span>{item.title}</span>}
                      {isCollapsed && (
                        <span className="sr-only">{item.title}</span>
                      )}
                    </Link>
                  )}

                  {/* Submenu */}
                  {item.submenu && !isCollapsed && (
                    <ul
                      className={cn(
                        'mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-300',
                        openSubmenus[item.title] || hasActiveSubmenu(item)
                          ? 'max-h-96 animate-fade-in'
                          : 'max-h-0 opacity-0'
                      )}
                    >
                      {item.submenu.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              'block px-4 py-2 text-sm rounded-md transition-colors',
                              isActiveLink(subItem.href)
                                ? 'text-primary dark:text-primary-light font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tooltip for collapsed sidebar */}
                  {isCollapsed && item.submenu && (
                    <div className="absolute left-full top-0 ml-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hidden group-hover:block group-hover:animate-scale-in z-50">
                      <ul className="py-1">
                        <li className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                          {item.title}
                        </li>
                        {item.submenu.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!isCollapsed ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} DigitalSpeed
              </p>
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                &copy;
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
