'use client';

import {
  FiFileText,
  FiBriefcase,
  FiShoppingBag,
  FiImage,
  FiMessageSquare,
} from 'react-icons/fi';

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
  const stats = [
    {
      title: 'Total Blogs',
      value: totalBlogs,
      icon: FiFileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: FiBriefcase,
      color: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: FiShoppingBag,
      color: 'bg-purple-500',
    },
    {
      title: 'Gallery Items',
      value: totalGalleryItems,
      icon: FiImage,
      color: 'bg-yellow-500',
    },
    {
      title: 'Contacts',
      value: totalContacts,
      icon: FiMessageSquare,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
        >
          <div className={`${stat.color} p-3 rounded-full`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
