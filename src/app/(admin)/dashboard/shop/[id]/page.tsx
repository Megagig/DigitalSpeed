import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductForm from '@/components/admin/shop/ProductForm';
import { PageProps } from 'next';

type EditProductPageProps = {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
