'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';

export default function CommentActions() {
  const router = useRouter();

  return (
    <>
      <Button variant="outline" size="sm" icon={FiFilter}>
        Filter
      </Button>
      <Button
        variant="outline"
        size="sm"
        icon={FiRefreshCw}
        onClick={() => router.refresh()}
      >
        Refresh
      </Button>
    </>
  );
}
