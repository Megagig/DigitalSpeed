'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaSearch } from 'react-icons/fa';

// Sample blog data (in a real app, this would come from your database)
const allBlogs = [
  {
    id: 1,
    title: 'Getting Started with Next.js and TypeScript',
    slug: 'getting-started-with-nextjs-and-typescript',
    excerpt:
      'Learn how to set up a new project with Next.js and TypeScript, and discover the benefits of this powerful combination.',
    featuredImage: '/images/placeholders/blog-1.jpg',
    date: 'June 15, 2023',
    author: 'John Doe',
    category: 'Web Development',
    tags: ['Next.js', 'TypeScript', 'React', 'Web Development'],
    views: 1245,
  },
  {
    id: 2,
    title: 'Building a RESTful API with Node.js and PostgreSQL',
    slug: 'building-restful-api-nodejs-postgresql',
    excerpt:
      'A comprehensive guide to creating a robust RESTful API using Node.js, Express, and PostgreSQL with best practices.',
    featuredImage: '/images/placeholders/blog-2.jpg',
    date: 'May 22, 2023',
    author: 'Jane Smith',
    category: 'Backend Development',
    tags: ['Node.js', 'PostgreSQL', 'API', 'Express', 'Backend'],
    views: 987,
  },
  {
    id: 3,
    title: 'Responsive Web Design Principles for 2023',
    slug: 'responsive-web-design-principles-2023',
    excerpt:
      'Explore the latest trends and best practices in responsive web design to create websites that look great on any device.',
    featuredImage: '/images/placeholders/blog-3.jpg',
    date: 'April 10, 2023',
    author: 'Michael Johnson',
    category: 'Web Design',
    tags: ['CSS', 'Responsive Design', 'UI/UX', 'Web Development'],
    views: 1532,
  },
  {
    id: 4,
    title: 'Introduction to React Hooks',
    slug: 'introduction-to-react-hooks',
    excerpt:
      'Learn how to use React Hooks to simplify your components and manage state more effectively in your React applications.',
    featuredImage: '/images/placeholders/blog-4.jpg',
    date: 'March 5, 2023',
    author: 'John Doe',
    category: 'Web Development',
    tags: ['React', 'Hooks', 'JavaScript', 'Web Development'],
    views: 2103,
  },
  {
    id: 5,
    title: 'Optimizing PostgreSQL Performance',
    slug: 'optimizing-postgresql-performance',
    excerpt:
      'Discover techniques and best practices for improving the performance of your PostgreSQL database in production environments.',
    featuredImage: '/images/placeholders/blog-5.jpg',
    date: 'February 18, 2023',
    author: 'Jane Smith',
    category: 'Database',
    tags: ['PostgreSQL', 'Performance', 'Database', 'Optimization'],
    views: 876,
  },
  {
    id: 6,
    title: 'Building a CI/CD Pipeline with GitHub Actions',
    slug: 'building-cicd-pipeline-github-actions',
    excerpt:
      'Learn how to set up a continuous integration and deployment pipeline for your projects using GitHub Actions.',
    featuredImage: '/images/placeholders/blog-6.jpg',
    date: 'January 30, 2023',
    author: 'Michael Johnson',
    category: 'DevOps',
    tags: ['CI/CD', 'GitHub Actions', 'DevOps', 'Automation'],
    views: 1345,
  },
];

// Get all unique categories
const allCategories = [
  'All',
  ...new Set(allBlogs.map((blog) => blog.category)),
];

// Get all unique tags
const allTags = [...new Set(allBlogs.flatMap((blog) => blog.tags))];

const BlogPage = () => {
  const [blogs, setBlogs] = useState(allBlogs);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter blogs based on category and search query
  useEffect(() => {
    let filtered = allBlogs;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter((blog) => blog.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setBlogs(filtered);
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our latest articles on web development, design, and digital
            marketing.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {allCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id}>
                <article className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                  <div className="relative h-56 w-full">
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
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {blog.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                      {blog.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}

        {/* Popular Tags */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag, index) => (
              <Link
                key={index}
                href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
