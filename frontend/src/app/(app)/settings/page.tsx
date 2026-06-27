'use client';
import { useEffect, useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [me, setMe] = useState<any>(null);
  useEffect(() => { fetch('/api/auth/me').then((r) => r.json()).then(setMe); }, []);
  if (!me?.user) return <div className="glass h-60 animate-pulse" />;
  return (
    <div className="space-y-6 max-w-3xl" data-testid="settings-page">
      <header>
        <span className="overline">Account</span>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-navy">Settings</h1>
      </header>
      <div className="glass p-6">
        <h2 className="font-bold text-brand-navy mb-4">Owner profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Field label="Owner name" value={me.user.ownerName} />
          <Field label="Email" value={me.user.email} />
          <Field label="Phone" value={me.user.phone || '—'} />
          <Field label="Role" value={me.user.role} />
        </div>
      </div>
      {me.business && (
        <div className="glass p-6">
          <h2 className="font-bold text-brand-navy mb-4">Business profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Field label="Business name" value={me.business.name} />
            <Field label="Business type" value={me.business.businessType || '—'} />
            <Field label="City" value={me.business.city || '—'} />
            <Field label="Preferred language" value={me.business.preferredLanguage} />
            <Field label="Plan tier" value={me.business.planTier} />
            <Field label="Call credits" value={String(me.business.callCredits)} />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3">
      <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</div>
      <div className="text-sm font-semibold text-brand-ink mt-1 capitalize">{value}</div>
    </div>
  );
}
