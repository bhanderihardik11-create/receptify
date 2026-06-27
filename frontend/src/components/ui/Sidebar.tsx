'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Upload, Megaphone, PlusCircle, Sparkles, History,
  Mic, FileText, BarChart3, FileStack, ShieldCheck, CreditCard, Settings, HelpCircle, LogOut,
} from 'lucide-react';
import { Logo } from './Logo';
import { toast } from 'sonner';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/customers/upload', label: 'Upload CSV', icon: Upload },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/campaigns/new', label: 'Create Campaign', icon: PlusCircle },
  { href: '/scripts', label: 'AI Script Generator', icon: Sparkles },
  { href: '/calls', label: 'Call History', icon: History },
  { href: '/calls?has_recording=1', label: 'Recordings', icon: Mic },
  { href: '/calls?has_transcript=1', label: 'Transcripts', icon: FileText },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/templates', label: 'Templates', icon: FileStack },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ user, business }: { user?: { ownerName: string; email: string }; business?: { name: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    if (base === '/dashboard') return pathname === '/dashboard';
    return pathname === base || pathname.startsWith(base + '/');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 bg-[#F8FAFC]/95 backdrop-blur-lg border-r border-slate-200 flex flex-col z-30"
      data-testid="dashboard-sidebar"
    >
      <div className="px-5 py-5 border-b border-slate-200">
        <Link href="/dashboard"><Logo /></Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-brand-50/60 hover:text-brand-700',
              )}
            >
              <Icon className={cn('w-4 h-4', active ? 'text-brand-600' : 'text-slate-500')} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-gradient text-white grid place-items-center font-semibold text-sm">
            {(user?.ownerName || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-brand-ink truncate">{user?.ownerName || 'User'}</div>
            <div className="text-xs text-slate-500 truncate">{business?.name || user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
