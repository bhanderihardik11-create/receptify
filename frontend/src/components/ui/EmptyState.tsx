import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon, title, description, action, className, testId,
}: { icon: LucideIcon; title: string; description?: string; action?: React.ReactNode; className?: string; testId?: string }) {
  return (
    <div className={cn('glass p-10 text-center', className)} data-testid={testId}>
      <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-50 grid place-items-center mb-4 relative">
        <div className="absolute inset-0 rounded-2xl bg-brand-100/60 blur-xl -z-10" />
        <Icon className="w-7 h-7 text-brand-600" />
      </div>
      <h3 className="text-lg font-bold text-brand-navy mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">{description}</p>}
      {action}
    </div>
  );
}
