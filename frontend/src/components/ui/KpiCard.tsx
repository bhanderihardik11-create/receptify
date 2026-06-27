import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export function KpiCard({
  label, value, icon: Icon, trend, accent, className, testId,
}: { label: string; value: string | number; icon?: LucideIcon; trend?: string; accent?: 'primary' | 'success' | 'warning' | 'danger'; className?: string; testId?: string }) {
  const accentMap = {
    primary: 'bg-brand-50 text-brand-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
  };
  const accentClass = accentMap[accent || 'primary'];

  return (
    <div className={cn('glass p-6 hover:shadow-glow-hover transition-shadow', className)} data-testid={testId}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {Icon && (
          <div className={cn('w-9 h-9 rounded-xl grid place-items-center', accentClass)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-3xl font-extrabold tracking-tight text-brand-navy">{value}</div>
      {trend && <div className="text-xs text-slate-500 mt-1">{trend}</div>}
    </div>
  );
}
