'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaSearch } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import { BlogWithRelations } from '@/types';

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogWithRelations[]>([]);
  const [allBlogs, setAllBlogs] = useState<BlogWithRelations[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();

        if (data.success && data.blogs) {
          setAllBlogs(data.blogs);
          setBlogs(data.blogs);

          // Extract categories
          const uniqueCategories = ['All'];
          data.blogs.forEach((blog: BlogWithRelations) => {
            if (
              blog.category &&
              !uniqueCategories.includes(blog.category.name)
            ) {
              uniqueCategories.push(blog.category.name);
            }
          });
          setCategories(uniqueCategories);

          // Extract tags
          const uniqueTags: string[] = [];
          data.blogs.forEach((blog: BlogWithRelations) => {
            blog.tags.forEach((tag) => {
              if (!uniqueTags.includes(tag.name)) {
                uniqueTags.push(tag.name);
              }
            });
          });
          setTags(uniqueTags);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on category and search query
  useEffect(() => {
    let filtered = allBlogs;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(
        (blog) => blog.category && blog.category.name === activeCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          (blog.excerpt && blog.excerpt.toLowerCase().includes(query)) ||
          blog.tags.some((tag) => tag.name.toLowerCase().includes(query))
      );
    }

    setBlogs(filtered);
  }, [activeCategory, searchQuery, allBlogs]);

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
              {categories.map((category, index) => (
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id}>
                <article className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                  <div className="relative h-56 w-full">
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
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {blog.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                      {blog.excerpt ||
                        (blog.content &&
                          blog.content.substring(0, 150) + '...')}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-xs"
                        >
                          {tag.name}
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
        {tags.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(tag)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
