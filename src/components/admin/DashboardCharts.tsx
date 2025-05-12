'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface DashboardChartsProps {
  blogsByCategory: { category: string; count: number }[];
  topSellingProducts: { product: string; sales: number }[];
  mostLikedProjects: { project: string; likes: number }[];
}

export default function DashboardCharts({
  blogsByCategory,
  topSellingProducts,
  mostLikedProjects,
}: DashboardChartsProps) {
  const [activeChart, setActiveChart] = useState<
    'blogs' | 'products' | 'projects' | 'overview'
  >('overview');
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkTheme = mounted && theme === 'dark';

  // Common chart colors
  const textColor = isDarkTheme
    ? 'rgba(229, 231, 235, 1)'
    : 'rgba(55, 65, 81, 1)';
  const gridColor = isDarkTheme
    ? 'rgba(75, 85, 99, 0.2)'
    : 'rgba(229, 231, 235, 0.5)';

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
      title: {
        display: true,
        color: textColor,
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: isDarkTheme
          ? 'rgba(31, 41, 55, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkTheme
          ? 'rgba(229, 231, 235, 1)'
          : 'rgba(17, 24, 39, 1)',
        bodyColor: isDarkTheme
          ? 'rgba(209, 213, 219, 1)'
          : 'rgba(55, 65, 81, 1)',
        borderColor: isDarkTheme
          ? 'rgba(75, 85, 99, 0.2)'
          : 'rgba(229, 231, 235, 0.8)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
        usePointStyle: true,
        bodyFont: {
          family: 'Inter, sans-serif',
        },
        titleFont: {
          family: 'Inter, sans-serif',
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
    },
  };

  // Blog categories data
  const blogCategoriesData = {
    labels: blogsByCategory.map((item) => item.category),
    datasets: [
      {
        label: 'Number of Blogs',
        data: blogsByCategory.map((item) => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Product sales data
  const productSalesData = {
    labels: topSellingProducts.map((item) => item.product),
    datasets: [
      {
        label: 'Sales',
        data: topSellingProducts.map((item) => item.sales),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Project likes data
  const projectLikesData = {
    labels: mostLikedProjects.map((item) => item.project),
    datasets: [
      {
        label: 'Likes',
        data: mostLikedProjects.map((item) => item.likes),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Overview data (line chart)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const overviewData = {
    labels: months,
    datasets: [
      {
        label: 'Blogs',
        data: [5, 8, 12, 15, 18, 22, 26, 28, 25, 30, 32, 35],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Projects',
        data: [3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 28, 30],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Products',
        data: [2, 4, 6, 8, 10, 12, 15, 18, 20, 22, 25, 28],
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Analytics Dashboard
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              activeChart === 'overview'
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
            onClick={() => setActiveChart('overview')}
          >
            Overview
          </button>
          <button
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              activeChart === 'blogs'
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
            onClick={() => setActiveChart('blogs')}
          >
            Blogs
          </button>
          <button
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              activeChart === 'products'
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
            onClick={() => setActiveChart('products')}
          >
            Products
          </button>
          <button
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              activeChart === 'projects'
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
            onClick={() => setActiveChart('projects')}
          >
            Projects
          </button>
        </div>
      </div>

      <div className="h-80">
        {activeChart === 'overview' && (
          <Line
            data={overviewData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: {
                  ...commonOptions.plugins.title,
                  text: 'Content Growth Overview',
                },
              },
            }}
          />
        )}

        {activeChart === 'blogs' && (
          <Bar
            data={blogCategoriesData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: {
                  ...commonOptions.plugins.title,
                  text: 'Blogs by Category',
                },
              },
            }}
          />
        )}

        {activeChart === 'products' && (
          <Pie
            data={productSalesData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: {
                  ...commonOptions.plugins.title,
                  text: 'Top Selling Products',
                },
              },
            }}
          />
        )}

        {activeChart === 'projects' && (
          <Bar
            data={projectLikesData}
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: {
                  ...commonOptions.plugins.title,
                  text: 'Most Liked Projects',
                },
              },
              indexAxis: 'y' as const,
            }}
          />
        )}
      </div>
    </div>
  );
}
