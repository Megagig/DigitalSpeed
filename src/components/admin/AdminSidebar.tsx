'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
} from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: FiLayout,
  },
  {
    title: 'Blogs',
    href: '/dashboard/blogs',
    icon: FiFileText,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FiBriefcase,
  },
  {
    title: 'Shop',
    href: '/dashboard/shop',
    icon: FiShoppingBag,
  },
  {
    title: 'Gallery',
    href: '/dashboard/gallery',
    icon: FiImage,
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

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-primary">
              DigitalSpeed Admin
            </h1>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors',
                      pathname === item.href &&
                        'bg-primary/10 text-primary font-medium'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DigitalSpeed
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
