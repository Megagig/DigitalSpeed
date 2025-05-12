import { prisma } from '@/lib/db';
import BlogForm from '@/components/admin/blogs/BlogForm';

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

export default async function NewBlogPage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Blog</h1>
      
      <BlogForm 
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
