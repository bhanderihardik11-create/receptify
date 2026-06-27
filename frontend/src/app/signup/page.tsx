'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const BIZ_TYPES = [
  'NBFC / Finance', 'Clinic / Healthcare', 'Diagnostic Lab', 'Real Estate',
  'Coaching / Ed-tech', 'Gym / Fitness', 'D2C Brand', 'Local Service Business', 'Other',
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    ownerName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    businessType: 'Clinic / Healthcare',
    city: '',
    preferredLanguage: 'en',
  });
  const [loading, setLoading] = useState(false);
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Signup failed');
        return;
      }
      toast.success('Account created! Welcome to Receptify.');
      router.push('/dashboard');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-marketing min-h-screen flex items-center justify-center px-4 py-10 relative" data-testid="signup-page">
      <div className="glow-orb w-96 h-96 -top-10 -left-10 bg-brand-100" />
      <div className="glow-orb w-96 h-96 -bottom-10 -right-10 bg-brand-50" />

      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block"><Logo /></Link>
        </div>
        <div className="glass-strong p-8 animate-fade-up">
          <h1 className="text-2xl font-extrabold text-brand-navy">Start your free trial</h1>
          <p className="text-sm text-slate-500 mt-1">No credit card required · 50 free call credits</p>

          <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Business name *</label>
              <input required value={form.businessName} onChange={(e) => update('businessName', e.target.value)} className="input-field" placeholder="e.g. Sharma Clinic" data-testid="signup-businessname-input" />
            </div>
            <div>
              <label className="label-base">Owner name *</label>
              <input required value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} className="input-field" placeholder="Your full name" data-testid="signup-ownername-input" />
            </div>
            <div>
              <label className="label-base">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="you@business.in" data-testid="signup-email-input" />
            </div>
            <div>
              <label className="label-base">Phone</label>
              <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" placeholder="+91 98765 43210" data-testid="signup-phone-input" />
            </div>
            <div>
              <label className="label-base">Password *</label>
              <input required minLength={8} type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="input-field" placeholder="Minimum 8 characters" data-testid="signup-password-input" />
            </div>
            <div>
              <label className="label-base">Business type</label>
              <select value={form.businessType} onChange={(e) => update('businessType', e.target.value)} className="input-field" data-testid="signup-businesstype-select">
                {BIZ_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-base">City</label>
              <input value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" placeholder="e.g. Mumbai" data-testid="signup-city-input" />
            </div>
            <div>
              <label className="label-base">Preferred language</label>
              <select value={form.preferredLanguage} onChange={(e) => update('preferredLanguage', e.target.value)} className="input-field" data-testid="signup-language-select">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="gu">Gujarati</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-2">
              <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="signup-submit-button">
                {loading ? 'Creating account…' : <>Create my account <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Already have an account? <Link href="/login" className="text-brand-700 font-semibold" data-testid="signup-login-link">Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
