'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { FiRefreshCw } from 'react-icons/fi';

export default function DashboardActions() {
  const router = useRouter();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      icon={FiRefreshCw}
      onClick={() => router.refresh()}
    >
      Refresh Data
    </Button>
  );
}
