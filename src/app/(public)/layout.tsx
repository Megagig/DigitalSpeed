import { ReactNode } from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <PublicHeader />
      <main className="flex-grow animate-fade-in">{children}</main>
      <PublicFooter />
    </div>
  );
}
