import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  className?: string;
  accent?: 'indigo' | 'green' | 'orange' | 'red' | 'purple';
}

const accentMap = {
  indigo: 'bg-indigo-50 text-indigo-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  accent = 'indigo',
}: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {icon && (
          <span className={cn('p-2 rounded-lg', accentMap[accent])}>
            {icon}
          </span>
        )}
      </div>
      <div>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {trend && (
        <div className={cn('text-xs font-medium', trend.value >= 0 ? 'text-green-600' : 'text-red-500')}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </div>
  );
}
