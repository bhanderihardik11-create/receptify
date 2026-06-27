'use client';
import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BillingPage() {
  const [business, setBusiness] = useState<any>(null);
  useEffect(() => { fetch('/api/auth/me').then((r) => r.json()).then((d) => setBusiness(d.business)); }, []);

  const plans = [
    { tier: 'starter', name: 'Starter', price: '₹999', calls: 250 },
    { tier: 'growth', name: 'Growth', price: '₹4,999', calls: 2000, featured: true },
    { tier: 'business', name: 'Business', price: '₹19,999', calls: 10000 },
  ];

  return (
    <div className="space-y-6 max-w-5xl" data-testid="billing-page">
      <header>
        <span className="overline">Plans & usage</span>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-navy">Billing</h1>
        <p className="text-slate-500 text-sm mt-1">View your plan, credits and upgrade anytime.</p>
      </header>

      {business && (
        <div className="glass-strong p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Current plan</div>
              <div className="text-2xl font-extrabold text-brand-navy mt-1 capitalize">{business.planTier}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Call credits remaining</div>
              <div className="text-2xl font-extrabold text-brand-700 mt-1">{business.callCredits}</div>
            </div>
            <button className="btn-primary text-sm" data-testid="billing-upgrade-button">Upgrade plan <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div key={p.tier} className={`glass p-6 relative ${p.featured ? 'ring-2 ring-brand-500 shadow-glow' : ''}`} data-testid={`billing-plan-${p.tier}`}>
            {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-bold px-3 py-1 rounded-full">Most popular</div>}
            <h3 className="font-bold text-brand-navy text-xl">{p.name}</h3>
            <div className="text-3xl font-extrabold text-brand-navy mt-3">{p.price}<span className="text-sm font-medium text-slate-500">/mo</span></div>
            <div className="text-sm text-brand-700 font-semibold mt-1">{p.calls.toLocaleString()} call credits</div>
            <button className={`mt-5 w-full ${p.featured ? 'btn-primary' : 'btn-secondary'}`}>
              {business?.planTier === p.tier ? 'Current plan' : 'Choose plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
