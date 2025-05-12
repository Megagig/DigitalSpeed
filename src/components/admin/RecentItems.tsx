'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate, truncate } from '@/lib/utils';
import { Blog, Project, Product, Contact } from '@prisma/client';

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
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects' | 'products' | 'contacts'>('blogs');

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex border-b">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'blogs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('blogs')}
        >
          Recent Blogs
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'projects'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('projects')}
        >
          Recent Projects
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'products'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Recent Products
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'contacts'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('contacts')}
        >
          Recent Contacts
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'blogs' && (
          <div className="space-y-4">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <div key={blog.id} className="border-b pb-3 last:border-0">
                  <Link href={`/dashboard/blogs/${blog.id}`} className="block hover:bg-gray-50 rounded p-2 -mx-2">
                    <h3 className="font-medium text-gray-900">{blog.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        {blog.category?.name || 'Uncategorized'}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(blog.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.published ? 'Published' : 'Draft'}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No blogs found</p>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div key={project.id} className="border-b pb-3 last:border-0">
                  <Link href={`/dashboard/projects/${project.id}`} className="block hover:bg-gray-50 rounded p-2 -mx-2">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>{truncate(project.description, 60)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>{formatDate(project.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{project.published ? 'Published' : 'Draft'}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No projects found</p>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="border-b pb-3 last:border-0">
                  <Link href={`/dashboard/shop/${product.id}`} className="block hover:bg-gray-50 rounded p-2 -mx-2">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="font-medium text-green-600">${product.price.toString()}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(product.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{product.published ? 'Published' : 'Draft'}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No products found</p>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact) => (
                <div key={contact.id} className="border-b pb-3 last:border-0">
                  <Link href={`/dashboard/contacts/${contact.id}`} className="block hover:bg-gray-50 rounded p-2 -mx-2">
                    <h3 className="font-medium text-gray-900">
                      {contact.firstName} {contact.lastName || ''}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>{contact.email}</span>
                      {contact.phone && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{contact.phone}</span>
                        </>
                      )}
                    </div>
                    {contact.project && (
                      <div className="text-sm text-gray-500 mt-1">
                        Project: {contact.project.title}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDate(contact.createdAt)}
                      <span className="mx-2">•</span>
                      <span className={contact.isRead ? 'text-green-600' : 'text-yellow-600'}>
                        {contact.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No contacts found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
