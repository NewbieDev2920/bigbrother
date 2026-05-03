import { cn } from '@/lib/cn';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex flex-wrap items-center gap-1 rounded-2xl border border-canvas-border bg-canvas-card p-1',
        className
      )}
    >
      {items.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-navy-900 text-white'
                : 'text-navy-700 hover:bg-navy-50'
            )}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'ml-2 rounded-full px-1.5 py-0.5 text-[11px] font-mono',
                  isActive ? 'bg-white/20 text-white' : 'bg-navy-50 text-navy-700'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
