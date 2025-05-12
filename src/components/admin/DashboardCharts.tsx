'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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
  const [activeChart, setActiveChart] = useState<'blogs' | 'products' | 'projects'>('blogs');

  // Prepare data for blogs by category chart
  const blogCategoriesData = {
    labels: blogsByCategory.map((item) => item.category),
    datasets: [
      {
        label: 'Number of Blogs',
        data: blogsByCategory.map((item) => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for top selling products chart
  const productSalesData = {
    labels: topSellingProducts.map((item) => item.product),
    datasets: [
      {
        label: 'Sales',
        data: topSellingProducts.map((item) => item.sales),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for most liked projects chart
  const projectLikesData = {
    labels: mostLikedProjects.map((item) => item.project),
    datasets: [
      {
        label: 'Likes',
        data: mostLikedProjects.map((item) => item.likes),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeChart === 'blogs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveChart('blogs')}
        >
          Blogs by Category
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeChart === 'products'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveChart('products')}
        >
          Top Selling Products
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeChart === 'projects'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveChart('projects')}
        >
          Most Liked Projects
        </button>
      </div>

      <div className="h-80">
        {activeChart === 'blogs' && (
          <Bar
            data={blogCategoriesData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
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
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
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
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Most Liked Projects',
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
