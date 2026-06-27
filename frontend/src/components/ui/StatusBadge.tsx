import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, PhoneOff, PhoneMissed, AlertCircle, PhoneCall as PhoneIcon, Calendar, Wallet, RefreshCw, UserX } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  queued: { label: 'Queued', bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock },
  ringing: { label: 'Ringing', bg: 'bg-blue-100', text: 'text-blue-700', icon: PhoneIcon },
  in_progress: { label: 'In Progress', bg: 'bg-amber-100', text: 'text-amber-700', icon: PhoneIcon },
  completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
  failed: { label: 'Failed', bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
  no_answer: { label: 'No Answer', bg: 'bg-slate-100', text: 'text-slate-600', icon: PhoneMissed },
  draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock },
  scheduled: { label: 'Scheduled', bg: 'bg-indigo-100', text: 'text-indigo-700', icon: Calendar },
  running: { label: 'Running', bg: 'bg-amber-100', text: 'text-amber-700', icon: PhoneIcon },
  paused: { label: 'Paused', bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock },
};

const OUTCOME_MAP: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  interested: { label: 'Interested', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
  not_interested: { label: 'Not Interested', bg: 'bg-slate-100', text: 'text-slate-700', icon: PhoneOff },
  callback_requested: { label: 'Callback Requested', bg: 'bg-amber-100', text: 'text-amber-700', icon: RefreshCw },
  payment_promised: { label: 'Payment Promised', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Wallet },
  appointment_confirmed: { label: 'Appointment Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Calendar },
  wrong_number: { label: 'Wrong Number', bg: 'bg-red-100', text: 'text-red-700', icon: UserX },
  no_answer: { label: 'No Answer', bg: 'bg-slate-100', text: 'text-slate-600', icon: PhoneMissed },
  failed: { label: 'Failed', bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
  pending: { label: 'Pending', bg: 'bg-slate-100', text: 'text-slate-600', icon: Clock },
};

export function StatusBadge({ status, type = 'status', className }: { status: string; type?: 'status' | 'outcome'; className?: string }) {
  const map = type === 'outcome' ? OUTCOME_MAP : STATUS_MAP;
  const conf = map[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock };
  const Icon = conf.icon;
  return (
    <span className={cn('badge', conf.bg, conf.text, className)} data-testid={`badge-${type}-${status}`}>
      <Icon className="w-3 h-3" />
      {conf.label}
    </span>
  );
}
