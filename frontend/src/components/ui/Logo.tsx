import { cn } from '@/lib/utils';
import { PhoneCall } from 'lucide-react';

export function Logo({ className, showText = true, variant = 'default' }: { className?: string; showText?: boolean; variant?: 'default' | 'white' }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)} data-testid="receptify-logo">
      <div className="relative w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow">
        <PhoneCall className="w-5 h-5 text-white" strokeWidth={2.5} />
        <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-extrabold tracking-tight text-lg', variant === 'white' ? 'text-white' : 'text-brand-navy')}>RECEPTIFY</span>
          <span className={cn('text-[10px] font-medium tracking-wide mt-0.5', variant === 'white' ? 'text-white/70' : 'text-slate-500')}>AI VOICE RECEPTIONIST</span>
        </div>
      )}
    </div>
  );
}
