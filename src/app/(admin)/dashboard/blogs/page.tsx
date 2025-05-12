import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { FiEdit, FiEye } from 'react-icons/fi';
import PageTitle from '@/components/admin/PageTitle';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import DeleteBlogButton from '@/components/admin/blogs/DeleteBlogButton';
import BlogActions from '@/components/admin/blogs/BlogActions';
import EmptyState from '@/components/admin/blogs/EmptyState';

async function getBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return blogs;
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
      <PageTitle
        title="Blogs"
        description="Manage your blog posts"
        breadcrumbs={[{ label: 'Blogs', href: '/dashboard/blogs' }]}
        actions={<BlogActions />}
      />

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Blog
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {blog.featuredImage ? (
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Image
                                src={blog.featuredImage}
                                alt={blog.title}
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 text-xs">
                                No img
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {blog.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {blog.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            blog.published
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          }`}
                        >
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={FiEye}
                            href={`/blog/${blog.slug}`}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={FiEdit}
                            href={`/dashboard/blogs/${blog.id}`}
                          />
                          <DeleteBlogButton blogId={blog.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <EmptyState />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
