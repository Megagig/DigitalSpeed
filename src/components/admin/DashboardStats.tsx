'use client';

import { useState, useEffect } from 'react';
import {
  FiFileText,
  FiBriefcase,
  FiShoppingBag,
  FiImage,
  FiMessageSquare,
  FiTrendingUp,
  FiTrendingDown,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  totalBlogs: number;
  totalProjects: number;
  totalProducts: number;
  totalGalleryItems: number;
  totalContacts: number;
}

export default function DashboardStats({
  totalBlogs,
  totalProjects,
  totalProducts,
  totalGalleryItems,
  totalContacts,
}: DashboardStatsProps) {
  // Animation for counting up
  const [counts, setCounts] = useState({
    blogs: 0,
    projects: 0,
    products: 0,
    gallery: 0,
    contacts: 0,
  });

  useEffect(() => {
    const duration = 1000; // ms
    const steps = 20;
    const stepTime = duration / steps;

    const incrementValues = {
      blogs: totalBlogs / steps,
      projects: totalProjects / steps,
      products: totalProducts / steps,
      gallery: totalGalleryItems / steps,
      contacts: totalContacts / steps,
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;

      if (currentStep >= steps) {
        setCounts({
          blogs: totalBlogs,
          projects: totalProjects,
          products: totalProducts,
          gallery: totalGalleryItems,
          contacts: totalContacts,
        });
        clearInterval(timer);
      } else {
        setCounts((prevCounts) => ({
          blogs: Math.round(incrementValues.blogs * currentStep),
          projects: Math.round(incrementValues.projects * currentStep),
          products: Math.round(incrementValues.products * currentStep),
          gallery: Math.round(incrementValues.gallery * currentStep),
          contacts: Math.round(incrementValues.contacts * currentStep),
        }));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [
    totalBlogs,
    totalProjects,
    totalProducts,
    totalGalleryItems,
    totalContacts,
  ]);

  const stats = [
    {
      title: 'Total Blogs',
      value: counts.blogs,
      total: totalBlogs,
      icon: FiFileText,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      trend: 5.2, // Percentage change
    },
    {
      title: 'Total Projects',
      value: counts.projects,
      total: totalProjects,
      icon: FiBriefcase,
      color: 'bg-green-500',
      lightColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      trend: 12.8,
    },
    {
      title: 'Total Products',
      value: counts.products,
      total: totalProducts,
      icon: FiShoppingBag,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      trend: -2.4,
    },
    {
      title: 'Gallery Items',
      value: counts.gallery,
      total: totalGalleryItems,
      icon: FiImage,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-100 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      trend: 8.7,
    },
    {
      title: 'Contacts',
      value: counts.contacts,
      total: totalContacts,
      icon: FiMessageSquare,
      color: 'bg-red-500',
      lightColor: 'bg-red-100 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      trend: 3.1,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 hover:shadow-md"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn(stat.lightColor, 'p-3 rounded-lg')}>
              <stat.icon className={cn('w-6 h-6', stat.textColor)} />
            </div>
            <div
              className={cn(
                'text-xs font-medium px-2 py-1 rounded-full flex items-center',
                stat.trend > 0
                  ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
                  : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
              )}
            >
              {stat.trend > 0 ? (
                <FiTrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <FiTrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(stat.trend)}%
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
