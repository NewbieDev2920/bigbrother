import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-16 text-center', className)}>
      <div className="rounded-full bg-navy-50 p-4 text-navy-300">
        <Icon size={28} />
      </div>
      <h3 className="font-serif text-lg text-navy-900">{title}</h3>
      {description && <p className="max-w-md text-sm text-navy-300">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
