'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaEye } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import { BlogWithRelations } from '@/types';

const RecentBlogSection = () => {
  const [blogs, setBlogs] = useState<BlogWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();

        if (data.success && data.blogs) {
          // Get only published blogs and sort by date
          const publishedBlogs = data.blogs
            .filter((blog: BlogWithRelations) => blog.published)
            .sort(
              (a: BlogWithRelations, b: BlogWithRelations) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 3); // Get only the 3 most recent blogs

          setBlogs(publishedBlogs);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent blogs:', error);
        setLoading(false);
      }
    };

    fetchRecentBlogs();
  }, []);
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Blog Posts
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Check out my latest articles on web development, design, and digital
            marketing.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id}>
                <article className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    {blog.featuredImage ? (
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                        <span className="text-gray-500 dark:text-gray-400">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <FaEye className="mr-2" />
                        {blog.views} views
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {blog.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                      {blog.excerpt ||
                        (blog.content &&
                          blog.content.substring(0, 150) + '...')}
                    </p>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      Read more →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-700 dark:text-gray-300">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogSection;
