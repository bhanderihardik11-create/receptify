import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="space-y-6 max-w-4xl" data-testid="compliance-page">
      <header>
        <span className="overline">Responsible calling</span>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-navy">Compliance</h1>
        <p className="text-slate-500 text-sm mt-1">Receptify is built to support responsible, consent-based customer calling.</p>
      </header>

      <div className="glass p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white grid place-items-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h2 className="font-bold text-brand-navy">Compliance-aware by design</h2>
            <p className="text-sm text-slate-600 mt-1">We help you stay within the spirit of Indian calling rules but please consult your legal or telecom advisor for full compliance requirements.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          {[
            'Consent-based calling — every campaign requires a checklist confirmation',
            'DND scrubbing on uploaded customer lists',
            'Calling time restrictions (default 09:00 – 19:00)',
            'Registered business use only',
            'Campaign guardrails before launch',
            'Avoid spam-like calling patterns automatically',
            'Customer opt-outs are honored',
            'Safe, polite reminder templates by default',
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-sm text-brand-ink">{t}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-900">
          <strong>Important:</strong> Receptify does not provide legal advice. Please consult your legal or telecom advisor to ensure your calling activity complies with applicable laws and regulations (including TRAI rules, DND registrations, and your industry-specific requirements).
        </div>
      </div>
    </div>
  );
}
