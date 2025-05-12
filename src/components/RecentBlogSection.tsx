'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaEye } from 'react-icons/fa';

// Sample blog data
const blogs = [
  {
    id: 1,
    title: 'Getting Started with Next.js and TypeScript',
    slug: 'getting-started-with-nextjs-and-typescript',
    excerpt: 'Learn how to set up a new project with Next.js and TypeScript, and discover the benefits of this powerful combination.',
    featuredImage: '/blog-placeholder-1.jpg',
    date: 'June 15, 2023',
    views: 1245,
  },
  {
    id: 2,
    title: 'Building a RESTful API with Node.js and PostgreSQL',
    slug: 'building-restful-api-nodejs-postgresql',
    excerpt: 'A comprehensive guide to creating a robust RESTful API using Node.js, Express, and PostgreSQL with best practices.',
    featuredImage: '/blog-placeholder-2.jpg',
    date: 'May 22, 2023',
    views: 987,
  },
  {
    id: 3,
    title: 'Responsive Web Design Principles for 2023',
    slug: 'responsive-web-design-principles-2023',
    excerpt: 'Explore the latest trends and best practices in responsive web design to create websites that look great on any device.',
    featuredImage: '/blog-placeholder-3.jpg',
    date: 'April 10, 2023',
    views: 1532,
  },
];

const RecentBlogSection = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Blog Posts
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Check out my latest articles on web development, design, and digital marketing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog.id}>
              <article className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {blog.date}
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
                    {blog.excerpt}
                  </p>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    Read more →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
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
