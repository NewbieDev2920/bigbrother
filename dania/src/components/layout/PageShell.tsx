import type { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { ToastContainer } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  contained?: boolean;
}

export function PageShell({ children, className, contained = true }: PageShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />
      <main className={cn(contained && 'mx-auto max-w-7xl px-4 py-8', className)}>{children}</main>
      <ToastContainer />
    </div>
  );
}
