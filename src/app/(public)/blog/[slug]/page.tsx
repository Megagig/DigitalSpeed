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

// Sample blog data (in a real app, this would come from your database)
const blogs = [
  {
    id: 1,
    title: 'Getting Started with Next.js and TypeScript',
    slug: 'getting-started-with-nextjs-and-typescript',
    excerpt:
      'Learn how to set up a new project with Next.js and TypeScript, and discover the benefits of this powerful combination.',
    content: `
      # Getting Started with Next.js and TypeScript

      Next.js and TypeScript are a powerful combination for building modern web applications. Next.js provides a robust framework for React applications with features like server-side rendering, static site generation, and API routes. TypeScript adds static typing to JavaScript, which can help catch errors early and improve developer productivity.

      ## Setting Up Your Project

      To create a new Next.js project with TypeScript, you can use the following command:

      \`\`\`bash
      npx create-next-app@latest my-app --typescript
      \`\`\`

      This will create a new Next.js project with TypeScript configuration already set up for you.

      ## Key Benefits

      ### 1. Type Safety

      TypeScript provides static type checking, which helps catch errors during development rather than at runtime. This can significantly reduce bugs in your application.

      ### 2. Better Developer Experience

      With TypeScript, you get better IDE support, including autocompletion, type inference, and inline documentation. This makes it easier to work with your code and understand what's happening.

      ### 3. Enhanced Maintainability

      Types serve as documentation for your code, making it easier for other developers (or future you) to understand how components and functions should be used.

      ## Basic TypeScript Patterns in Next.js

      ### Typing Props

      \`\`\`typescript
      interface HomeProps {
        posts: {
          id: number;
          title: string;
          content: string;
        }[];
      }

      export default function Home({ posts }: HomeProps) {
        return (
          <div>
            {posts.map((post) => (
              <article key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
              </article>
            ))}
          </div>
        );
      }
      \`\`\`

      ### API Routes

      \`\`\`typescript
      import type { NextApiRequest, NextApiResponse } from 'next';

      type Data = {
        name: string;
      };

      export default function handler(
        req: NextApiRequest,
        res: NextApiResponse<Data>
      ) {
        res.status(200).json({ name: 'John Doe' });
      }
      \`\`\`

      ## Conclusion

      Next.js and TypeScript together provide a robust foundation for building modern web applications. The combination of Next.js's powerful features and TypeScript's type safety creates an excellent developer experience and helps produce more reliable applications.
    `,
    featuredImage: '/images/placeholders/blog-1.jpg',
    date: 'June 15, 2023',
    author: 'John Doe',
    authorImage: '/images/placeholders/author-1.jpg',
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
    content: `
      # Building a RESTful API with Node.js and PostgreSQL

      Creating a robust RESTful API is a common requirement for modern web applications. In this guide, we'll explore how to build an API using Node.js, Express, and PostgreSQL.

      ## Setting Up Your Project

      First, let's initialize a new Node.js project:

      \`\`\`bash
      mkdir api-project
      cd api-project
      npm init -y
      \`\`\`

      Next, install the necessary dependencies:

      \`\`\`bash
      npm install express pg dotenv cors helmet
      npm install --save-dev typescript ts-node @types/express @types/pg @types/node nodemon
      \`\`\`

      ## Database Setup

      Create a PostgreSQL database for your project. You can use the following SQL commands:

      \`\`\`sql
      CREATE DATABASE api_db;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      \`\`\`

      ## Project Structure

      A well-organized project structure helps maintain your code:

      \`\`\`
      /api-project
        /src
          /controllers
          /middleware
          /models
          /routes
          /utils
          app.ts
          server.ts
        .env
        package.json
        tsconfig.json
      \`\`\`

      ## Implementing the API

      ### Database Connection

      Create a database connection file:

      \`\`\`typescript
      // src/utils/db.ts
      import { Pool } from 'pg';
      import dotenv from 'dotenv';

      dotenv.config();

      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432'),
      });

      export default pool;
      \`\`\`

      ### User Model

      \`\`\`typescript
      // src/models/user.model.ts
      import db from '../utils/db';

      export interface User {
        id: number;
        name: string;
        email: string;
        password: string;
        created_at: Date;
      }

      export async function getAllUsers(): Promise<User[]> {
        const result = await db.query('SELECT * FROM users');
        return result.rows;
      }

      export async function getUserById(id: number): Promise<User | null> {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows.length ? result.rows[0] : null;
      }

      export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
        const result = await db.query(
          'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
          [user.name, user.email, user.password]
        );
        return result.rows[0];
      }
      \`\`\`

      ## Conclusion

      Building a RESTful API with Node.js and PostgreSQL provides a solid foundation for your web applications. By following best practices for project structure, error handling, and security, you can create a robust API that scales well and is easy to maintain.
    `,
    featuredImage: '/images/placeholders/blog-2.jpg',
    date: 'May 22, 2023',
    author: 'Jane Smith',
    authorImage: '/images/placeholders/author-2.jpg',
    category: 'Backend Development',
    tags: ['Node.js', 'PostgreSQL', 'API', 'Express', 'Backend'],
    views: 987,
  },
];

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the blog post data from your API
    const foundPost = blogs.find((p) => p.slug === slug);
    setPost(foundPost);

    // Find related posts (posts with the same category or tags)
    if (foundPost) {
      const related = blogs
        .filter(
          (p) =>
            p.id !== foundPost.id &&
            (p.category === foundPost.category ||
              p.tags.some((tag) => foundPost.tags.includes(tag)))
        )
        .slice(0, 3);
      setRelatedPosts(related);
    }

    setLoading(false);
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
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{post.author}</span>
            </div>

            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>{post.date}</span>
            </div>

            <div className="flex items-center">
              <FaEye className="mr-2" />
              <span>{post.views} views</span>
            </div>

            <div className="flex items-center">
              <FaTag className="mr-2" />
              <span>{post.category}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            {post.content
              .split('\n')
              .map((paragraph: string, index: number) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                      {paragraph.substring(2)}
                    </h1>
                  );
                } else if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
                      {paragraph.substring(3)}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold mt-5 mb-2">
                      {paragraph.substring(4)}
                    </h3>
                  );
                } else if (paragraph.startsWith('```')) {
                  return null; // Skip code block markers
                } else if (paragraph.trim() === '') {
                  return null; // Skip empty lines
                } else {
                  return (
                    <p key={index} className="my-4">
                      {paragraph}
                    </p>
                  );
                }
              })}
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <Link
                  key={index}
                  href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

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
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 flex-grow">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <FaCalendarAlt className="mr-1" />
                          <span>{relatedPost.date}</span>
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
