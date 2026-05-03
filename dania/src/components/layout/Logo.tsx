import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  to?: string;
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

const iconSize = { sm: 16, md: 22, lg: 32 };

export function Logo({ size = 'md', className, to = '/' }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-2 font-serif font-semibold text-navy-900',
        sizeClasses[size],
        className
      )}
    >
      <Scale size={iconSize[size]} className="text-navy-700" strokeWidth={2.2} />
      <span className="tracking-tight">Dania</span>
    </Link>
  );
}
