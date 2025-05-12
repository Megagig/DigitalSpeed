'use client';

import Link from 'next/link';
import { FiEye, FiEdit2 } from 'react-icons/fi';
import DeleteProductButton from '@/components/admin/shop/DeleteProductButton';

interface ProductActionButtonsProps {
  productId: string;
  productSlug: string;
}

export default function ProductActionButtons({ productId, productSlug }: ProductActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-3">
      <Link
        href={`/shop/${productSlug}`}
        className="text-blue-600 hover:text-blue-800"
        title="View product"
        target="_blank"
      >
        <FiEye size={18} />
      </Link>
      <Link
        href={`/dashboard/shop/${productId}`}
        className="text-indigo-600 hover:text-indigo-800"
        title="Edit product"
      >
        <FiEdit2 size={18} />
      </Link>
      <DeleteProductButton productId={productId} />
    </div>
  );
}
