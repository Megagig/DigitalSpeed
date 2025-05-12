'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Tag, Blog } from '@prisma/client';
import { slugify } from '@/lib/utils';
import { uploadImage } from '@/lib/cloudinary';
import { FiArrowLeft, FiSave, FiImage } from 'react-icons/fi';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  blog?: Blog & { tags: Tag[] };
  categories: Category[];
  tags: Tag[];
}

export default function BlogForm({ blog, categories, tags }: BlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: blog
      ? {
          ...blog,
          tags: blog.tags.map((tag) => tag.id),
        }
      : {
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          featuredImage: '',
          published: false,
          categoryId: '',
          tags: [],
        },
  });

  const title = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !blog) {
      setValue('slug', slugify(title));
    }
  }, [title, setValue, blog]);

  const handleImageUploaded = (url: string) => {
    setValue('featuredImage', url);
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create or update blog
      const response = await fetch(
        blog ? `/api/blogs/${blog.id}` : '/api/blogs',
        {
          method: blog ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save blog');
      }

      router.push('/dashboard/blogs');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              {...register('slug')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              {...register('categoryId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags
            </label>
            <select
              id="tags"
              multiple
              {...register('tags')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hold Ctrl (or Cmd) to select multiple tags
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={2}
            {...register('excerpt')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="A short summary of the blog post"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content *
          </label>
          <textarea
            id="content"
            rows={10}
            {...register('content')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <div className="mt-1">
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              currentImage={blog?.featuredImage}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            {...register('published')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-700"
          >
            Publish this blog post
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <Link
            href="/dashboard/blogs"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FiArrowLeft size={16} className="mr-2" />
            Back to Blogs
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave size={16} className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
