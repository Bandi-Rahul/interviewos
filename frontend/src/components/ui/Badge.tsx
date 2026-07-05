import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'solved' | 'attempted' | 'not_started' | 'needs_revision' | 'mastered' | 'default';
  className?: string;
}

const variantMap: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
  solved: 'bg-blue-100 text-blue-700',
  mastered: 'bg-purple-100 text-purple-700',
  attempted: 'bg-orange-100 text-orange-700',
  not_started: 'bg-gray-100 text-gray-600',
  needs_revision: 'bg-amber-100 text-amber-700',
  default: 'bg-gray-100 text-gray-700',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantMap[variant] ?? variantMap.default,
        className
      )}
    >
      {children}
    </span>
  );
}
