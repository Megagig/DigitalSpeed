import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import BlogForm from '@/components/admin/blogs/BlogForm';
import { PageProps } from 'next';

type EditBlogPageProps = {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
};

async function getBlog(id: string) {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!blog) {
    notFound();
  }

  return blog;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return categories;
}

async function getTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  return tags;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const [blog, categories, tags] = await Promise.all([
    getBlog(params.id),
    getCategories(),
    getTags(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Blog</h1>

      <BlogForm blog={blog} categories={categories} tags={tags} />
    </div>
  );
}
