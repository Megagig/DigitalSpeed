'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaCalendarAlt,
  FaEye,
  FaUser,
  FaTag,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import { BlogWithRelations } from '@/types';
import ReactMarkdown from 'react-markdown';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogWithRelations[]>([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Fetch the blog post by slug
        const response = await fetch(`/api/blogs/slug/${slug}`);

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success && data.blog) {
          setPost(data.blog);

          // Increment view count
          fetch(`/api/blogs/${data.blog.id}/view`, {
            method: 'POST',
          }).catch((error) =>
            console.error('Error incrementing view count:', error)
          );

          // Fetch related posts
          const relatedResponse = await fetch(
            `/api/blogs/related/${data.blog.id}`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            if (relatedData.success && relatedData.blogs) {
              setRelatedPosts(relatedData.blogs);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Blog Post Not Found
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          The blog post you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/blog"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Blog Post Header */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-8 gap-4">
            <div className="flex items-center">
              <FaUser className="mr-2" />
              <span>Admin</span>
            </div>

            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <div className="flex items-center">
              <FaEye className="mr-2" />
              <span>{post.views} views</span>
            </div>

            {post.category && (
              <div className="flex items-center">
                <FaTag className="mr-2" />
                <span>{post.category.name}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="bg-gray-900 rounded-md overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200 text-xs">
                        <span>{match[1]}</span>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code
                      className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.name}`}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share Links */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Share:
            </h3>
            <div className="flex space-x-4">
              <a
                href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 transition-colors"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Posts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
                    <article className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                      <div className="relative h-48 w-full">
                        {relatedPost.featuredImage ? (
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
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
                      <div className="p-4 flex-grow flex flex-col">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 flex-grow">
                          {relatedPost.excerpt ||
                            (relatedPost.content &&
                              relatedPost.content.substring(0, 100) + '...')}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(relatedPost.createdAt)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
