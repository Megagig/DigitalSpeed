'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate, formatDistanceToNow, truncate, cn } from '@/lib/utils';
import { Blog, Project, Product, Contact } from '@prisma/client';
import {
  FiFileText,
  FiBriefcase,
  FiShoppingBag,
  FiMessageSquare,
  FiClock,
  FiCalendar,
  FiTag,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

interface RecentItemsProps {
  recentBlogs: (Blog & { category: { name: string } | null })[];
  recentProjects: Project[];
  recentProducts: Product[];
  recentContacts: (Contact & { project: Project | null })[];
}

export default function RecentItems({
  recentBlogs,
  recentProjects,
  recentProducts,
  recentContacts,
}: RecentItemsProps) {
  const [activeTab, setActiveTab] = useState<
    'blogs' | 'projects' | 'products' | 'contacts'
  >('blogs');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
        <button
          className={cn(
            'px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'blogs'
              ? 'text-primary border-b-2 border-primary dark:text-primary-light dark:border-primary-light'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
          onClick={() => setActiveTab('blogs')}
        >
          <div className="flex items-center">
            <FiFileText className="mr-2" />
            <span>Recent Blogs</span>
          </div>
        </button>
        <button
          className={cn(
            'px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'projects'
              ? 'text-primary border-b-2 border-primary dark:text-primary-light dark:border-primary-light'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
          onClick={() => setActiveTab('projects')}
        >
          <div className="flex items-center">
            <FiBriefcase className="mr-2" />
            <span>Recent Projects</span>
          </div>
        </button>
        <button
          className={cn(
            'px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'products'
              ? 'text-primary border-b-2 border-primary dark:text-primary-light dark:border-primary-light'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
          onClick={() => setActiveTab('products')}
        >
          <div className="flex items-center">
            <FiShoppingBag className="mr-2" />
            <span>Recent Products</span>
          </div>
        </button>
        <button
          className={cn(
            'px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'contacts'
              ? 'text-primary border-b-2 border-primary dark:text-primary-light dark:border-primary-light'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
          onClick={() => setActiveTab('contacts')}
        >
          <div className="flex items-center">
            <FiMessageSquare className="mr-2" />
            <span>Recent Contacts</span>
          </div>
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'blogs' && (
          <div className="space-y-4">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0"
                >
                  <Link
                    href={`/dashboard/blogs/${blog.id}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md p-3 -mx-3 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {blog.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <FiTag className="mr-1" />
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          {blog.category?.name || 'Uncategorized'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>{formatDistanceToNow(blog.createdAt)} ago</span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs',
                            blog.published
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          )}
                        >
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center">
                <FiFileText className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-600" />
                <p>No blogs found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0"
                >
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md p-3 -mx-3 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {truncate(project.description, 60)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs',
                            project.published
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          )}
                        >
                          {project.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center">
                <FiBriefcase className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-600" />
                <p>No projects found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0"
                >
                  <Link
                    href={`/dashboard/shop/${product.id}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md p-3 -mx-3 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <FiDollarSign className="mr-1" />
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ${product.price.toString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>
                          {formatDistanceToNow(product.createdAt)} ago
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs',
                            product.published
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          )}
                        >
                          {product.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center">
                <FiShoppingBag className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-600" />
                <p>No products found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0"
                >
                  <Link
                    href={`/dashboard/contacts/${contact.id}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md p-3 -mx-3 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {contact.firstName} {contact.lastName || ''}
                      </h3>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs flex items-center',
                          contact.isRead
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        )}
                      >
                        {contact.isRead ? (
                          <>
                            <FiCheckCircle className="mr-1" />
                            <span>Read</span>
                          </>
                        ) : (
                          <>
                            <FiAlertCircle className="mr-1" />
                            <span>Unread</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <FiMail className="mr-1" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center">
                          <FiPhone className="mr-1" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                    {contact.project && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md inline-block">
                        <span className="font-medium">Project:</span>{' '}
                        {contact.project.title}
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <FiCalendar className="mr-1" />
                      <span>{formatDate(contact.createdAt)}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center">
                <FiMessageSquare className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-600" />
                <p>No contacts found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
