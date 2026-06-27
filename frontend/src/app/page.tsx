import Link from 'next/link';
import Image from 'next/image';
import {
  PhoneCall, Sparkles, Upload, Calendar, BarChart3, Megaphone, ShieldCheck,
  Building2, HeartPulse, Home, Dumbbell, ShoppingBag, Wrench, GraduationCap, Landmark,
  CheckCircle2, ArrowRight, Mic, FileSpreadsheet, Languages, FileText, ChevronDown,
  Wallet, RefreshCw, Bell, MessageSquareHeart, PackageCheck, IndianRupee,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingPage() {
  return (
    <main className="bg-marketing min-h-screen" data-testid="landing-page">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/60 border-b border-white/40">
        <div className="container-max flex items-center justify-between px-6 py-4">
          <Link href="/"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-brand-600 transition-colors" data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, '-')}`}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost text-sm" data-testid="nav-login">Sign in</Link>
            <Link href="/signup" className="btn-primary text-sm py-2.5" data-testid="nav-signup">Start free trial</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative section-padding overflow-hidden">
        <div className="glow-orb w-[480px] h-[480px] -top-32 -left-20 bg-brand-100" />
        <div className="glow-orb w-[460px] h-[460px] -bottom-24 -right-10 bg-brand-50" />

        <div className="container-max relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="overline" data-testid="hero-eyebrow">India&apos;s AI Calling Platform · Built for SMEs</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-navy leading-[1.05]">
              Run professional <span className="text-gradient">AI calling campaigns</span> for every customer reminder.
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl">
              Upload your customers, pick a calling purpose, generate a polite Indian-language script, and let an AI voice agent handle hundreds of calls — payment reminders, appointment reminders, lead follow-ups and more.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary" data-testid="hero-cta-primary">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="btn-secondary" data-testid="hero-cta-secondary">
                Watch Demo
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
              {[
                { icon: ShieldCheck, label: 'DND-safe' },
                { icon: IndianRupee, label: 'India-focused' },
                { icon: Mic, label: 'AI voice calls' },
                { icon: FileSpreadsheet, label: 'CSV upload' },
                { icon: Languages, label: 'Hindi · English · Gujarati' },
              ].map((b, i) => (
                <div key={i} className="badge bg-white/80 border border-brand-100 text-brand-700">
                  <b.icon className="w-3.5 h-3.5" /> {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="lg:col-span-5 relative animate-fade-in" data-testid="hero-visual">
            <div className="relative">
              <div className="glass-strong p-5 relative z-10 max-w-md ml-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 grid place-items-center text-brand-600">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-navy">Live campaign</div>
                      <div className="text-xs text-slate-500">Payment Reminders · Jan batch</div>
                    </div>
                  </div>
                  <div className="badge bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Running
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[{ l: 'Total', v: '248' }, { l: 'Answered', v: '187' }, { l: 'Promised', v: '94' }].map((s, i) => (
                    <div key={i} className="bg-white/80 rounded-xl p-3 border border-slate-100">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{s.l}</div>
                      <div className="text-lg font-extrabold text-brand-navy">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { n: 'Priya P.', t: 'Appointment confirmed', s: 'success' },
                    { n: 'Rohan M.', t: 'Callback requested', s: 'amber' },
                    { n: 'Sneha I.', t: 'Payment promised', s: 'success' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-xs px-3 py-2 bg-white/70 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-gradient text-white grid place-items-center text-[10px] font-bold">
                          {r.n.split(' ')[0].charAt(0)}
                        </div>
                        <span className="font-medium text-brand-ink">{r.n}</span>
                      </div>
                      <span className={r.s === 'success' ? 'text-emerald-600' : 'text-amber-600'}>{r.t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass absolute -bottom-6 -left-6 p-4 w-56 z-0 animate-float">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-brand-navy">AI Script Generator</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  &ldquo;Namaste {'{name}'}, this is a reminder from {'{business}'}...&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section-padding bg-white/40">
        <div className="container-max grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <span className="overline">The problem</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
              Manual calling drains your team and your money.
            </h2>
            <p className="mt-5 text-slate-600">
              Small Indian businesses spend hours every day calling customers — for reminders, follow-ups, renewals. Most of it is repetitive, easy to delay, and impossible to scale.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Manual calling takes too much team time',
              'Hiring full-time calling teams is expensive',
              'Hot leads slip away due to missed follow-ups',
              'Reminders get delayed, customers get late fees',
              'Quality is inconsistent across agents',
              'Hard to track who called, who answered, who replied',
            ].map((t, i) => (
              <div key={i} className="glass p-5 flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 grid place-items-center shrink-0">
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </div>
                <div className="text-sm font-medium text-brand-ink">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION + HOW IT WORKS */}
      <section id="how-it-works" className="section-padding">
        <div className="container-max text-center mb-14">
          <span className="overline">How Receptify works</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight max-w-3xl mx-auto">
            From customer list to completed calls — in 5 simple steps.
          </h2>
        </div>
        <div className="container-max grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { icon: Upload, t: 'Upload customers', d: 'Add manually or upload a CSV/Excel.' },
            { icon: Megaphone, t: 'Pick a use case', d: 'Reminders, follow-ups, renewals & more.' },
            { icon: Sparkles, t: 'Generate AI script', d: 'Polite, Indian-language scripts in seconds.' },
            { icon: Calendar, t: 'Schedule campaign', d: 'Pick date, time and calling window.' },
            { icon: BarChart3, t: 'Track results', d: 'Outcomes, recordings, transcripts, analytics.' },
          ].map((s, i) => (
            <div key={i} className="glass p-6 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-gradient text-white grid place-items-center mx-auto mb-4 shadow-glow">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="absolute top-3 right-4 text-xs font-bold text-brand-100">0{i + 1}</div>
              <h3 className="text-base font-bold text-brand-navy">{s.t}</h3>
              <p className="text-sm text-slate-500 mt-1.5">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="section-padding bg-white/40">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="overline">Use cases</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
              Built for the calls Indian businesses make every day.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Wallet, t: 'Payment Reminders', d: 'Polite EMI, invoice, due-date reminders.' },
              { icon: Calendar, t: 'Appointment Reminders', d: 'Confirm slot, reduce no-shows.' },
              { icon: MessageSquareHeart, t: 'Lead Follow-ups', d: 'Re-engage warm enquiries automatically.' },
              { icon: Bell, t: 'Feedback Calls', d: 'Capture quick customer feedback.' },
              { icon: Calendar, t: 'Event Reminders', d: 'Nudge attendees a day before.' },
              { icon: RefreshCw, t: 'Service Renewals', d: 'Renewal reminders that actually convert.' },
              { icon: PackageCheck, t: 'COD Confirmations', d: 'Confirm order before dispatch.' },
              { icon: RefreshCw, t: 'Reactivation Calls', d: 'Win back inactive customers.' },
            ].map((c, i) => (
              <div key={i} className="glass p-5 hover:-translate-y-1 hover:shadow-glow-hover transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center mb-3">
                  <c.icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-brand-navy">{c.t}</h3>
                <p className="text-sm text-slate-500 mt-1">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="overline">Industries</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
              Trusted across small businesses & services.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Landmark, t: 'NBFCs & Finance', d: 'EMI reminders, KYC follow-ups, collections.' },
              { icon: HeartPulse, t: 'Clinics & Diagnostic Labs', d: 'Appointment slots, report ready notifications.' },
              { icon: Home, t: 'Real Estate', d: 'Lead follow-ups, site-visit reminders.' },
              { icon: Dumbbell, t: 'Gyms & Fitness', d: 'Membership renewals, class reminders.' },
              { icon: ShoppingBag, t: 'D2C Brands', d: 'COD confirmations, abandoned cart calls.' },
              { icon: Wrench, t: 'Local Service Businesses', d: 'Service renewals, appointment confirmations.' },
              { icon: GraduationCap, t: 'Coaching & Ed-Tech', d: 'Admission follow-ups, batch reminders.' },
              { icon: Building2, t: 'And many more', d: 'Configure for any reminder-style flow.' },
            ].map((c, i) => (
              <div key={i} className="glass p-6 flex gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy">{c.t}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section-padding bg-white/40">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="overline">Features</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
              Everything you need to run AI calling campaigns.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: FileSpreadsheet, t: 'CSV / Excel customer upload', d: 'Bulk import with column mapping & validation.' },
              { icon: Sparkles, t: 'AI script generator', d: 'Generate polite Indian scripts in seconds.' },
              { icon: FileText, t: 'Pre-built templates', d: 'Industry-ready templates for every use case.' },
              { icon: Calendar, t: 'Campaign scheduling', d: 'Pick date, time, calling window, retries.' },
              { icon: PhoneCall, t: 'AI voice calling', d: 'Natural AI voice agents place every call.' },
              { icon: Languages, t: 'Multilingual scripts', d: 'English, Hindi, Gujarati out of the box.' },
              { icon: BarChart3, t: 'Call status tracking', d: 'Real-time campaign progress dashboard.' },
              { icon: Mic, t: 'Recordings & transcripts', d: 'Listen back, read transcripts, AI summary.' },
              { icon: ShieldCheck, t: 'Compliance-aware', d: 'DND scrubbing & calling-time guardrails.' },
            ].map((f, i) => (
              <div key={i} className="glass p-6">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white grid place-items-center mb-3 shadow-glow">
                  <f.icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-brand-navy">{f.t}</h3>
                <p className="text-sm text-slate-500 mt-1">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE */}
      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <span className="overline">Compliance-aware by design</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
              Built to support responsible calling.
            </h2>
            <p className="mt-5 text-slate-600">
              Receptify is built for legitimate customer communication — not spam. We help you stay within the spirit of Indian calling rules, but please consult your legal or telecom advisor for full compliance requirements.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Consent-based calling workflows',
              'DND scrubbing on uploaded lists',
              'Calling-time restrictions (09:00 – 19:00)',
              'Registered business use only',
              'Campaign guardrails before launch',
              'Avoid spam-like calling patterns',
              'Customer opt-out is honoured',
              'Safe, polite reminder templates',
            ].map((t, i) => (
              <div key={i} className="glass p-4 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm text-brand-ink font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="section-padding bg-white/40">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="overline">Dashboard preview</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
              A control room for every calling campaign.
            </h2>
          </div>
          <div className="glass-strong p-6 lg:p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { l: 'Total calls', v: '12,438', c: 'text-brand-600' },
                { l: 'Answered', v: '9,212', c: 'text-emerald-600' },
                { l: 'Failed', v: '482', c: 'text-red-600' },
                { l: 'Callbacks', v: '1,089', c: 'text-amber-600' },
              ].map((k, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k.l}</div>
                  <div className={`text-2xl font-extrabold mt-1 ${k.c}`}>{k.v}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-brand-navy">Active Campaigns</h4>
                  <span className="text-xs text-slate-500">Last 7 days</span>
                </div>
                <div className="space-y-3">
                  {[
                    { n: 'EMI Reminder Batch', p: 78 },
                    { n: 'Clinic Appointments — Feb', p: 54 },
                    { n: 'Membership Renewals', p: 91 },
                  ].map((c, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-medium text-brand-ink">{c.n}</span>
                        <span className="text-slate-500">{c.p}%</span>
                      </div>
                      <div className="h-2 bg-brand-50 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-gradient" style={{ width: `${c.p}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <h4 className="font-bold text-brand-navy mb-4">Outcome breakdown</h4>
                {[
                  { l: 'Interested', v: 38, c: 'bg-emerald-500' },
                  { l: 'Callback', v: 22, c: 'bg-amber-500' },
                  { l: 'Not interested', v: 18, c: 'bg-slate-400' },
                  { l: 'Failed', v: 12, c: 'bg-red-500' },
                  { l: 'No answer', v: 10, c: 'bg-slate-300' },
                ].map((o, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <span className={`w-2 h-2 rounded-full ${o.c}`} />
                    <span className="text-sm text-slate-600 flex-1">{o.l}</span>
                    <span className="text-sm font-bold text-brand-navy">{o.v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="overline">Benefits</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
              Why teams switch to AI calling.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              'Save calling time and team bandwidth',
              'Reduce manual repetitive work',
              'Improve follow-up consistency',
              'Reach more customers, faster',
              'Track every call outcome in one place',
              'Lower operational cost vs. agents',
              'Never miss a reminder',
              'Send polite, on-brand messages',
              'Scale up & down without hiring',
            ].map((t, i) => (
              <div key={i} className="glass p-5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-brand-ink">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section-padding bg-white/40">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="overline">Pricing</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">Simple plans. Start free.</h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">All plans include AI script generation, dashboard, and analytics. Upgrade or downgrade anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '₹999', tagline: 'For small businesses testing AI calls', calls: '250', features: ['AI script generator', 'CSV/Excel upload', 'Call dashboard', 'Email support'] },
              { name: 'Growth', price: '₹4,999', tagline: 'For growing businesses with regular calling', calls: '2,000', features: ['Everything in Starter', 'Recordings & transcripts', 'Multi-language support', 'Priority email support'], featured: true },
              { name: 'Business', price: '₹19,999', tagline: 'For high-volume calling teams', calls: '10,000', features: ['Everything in Growth', 'Team members', 'Advanced analytics', 'Priority phone support'] },
            ].map((p, i) => (
              <div key={i} className={`glass p-7 relative ${p.featured ? 'ring-2 ring-brand-500 shadow-glow' : ''}`} data-testid={`pricing-${p.name.toLowerCase()}`}>
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-bold px-3 py-1 rounded-full">Most popular</div>
                )}
                <h3 className="text-xl font-bold text-brand-navy">{p.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{p.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-brand-navy">{p.price}</span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-brand-600">{p.calls} call credits/month</div>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`mt-7 w-full ${p.featured ? 'btn-primary' : 'btn-secondary'}`} data-testid={`pricing-cta-${p.name.toLowerCase()}`}>
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-12">
            <span className="overline">FAQ</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">Common questions.</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Is AI calling legal in India?', a: 'Yes — for legitimate customer communication where you have a relationship and consent (e.g., reminders, follow-ups). Always consult your legal advisor for your specific use case.' },
              { q: 'Can I upload customers using Excel?', a: 'Yes. You can upload a CSV or Excel file, map columns, validate phone numbers and confirm import — all in one flow.' },
              { q: 'Can I customize the call script?', a: 'Absolutely. Generate an AI script, edit it, choose a tone/language, and save it as a template for future campaigns.' },
              { q: 'Can I use this for payment reminders?', a: 'Yes — payment, EMI, invoice and renewal reminders are core use cases. Use the polite tone templates designed for them.' },
              { q: 'Can I see call recordings and transcripts?', a: 'Yes. Every completed call gets a recording, a transcript, and an AI summary with the recommended next action.' },
              { q: 'Can I track who answered or requested a callback?', a: 'Yes. Each call gets an outcome tag (interested, callback requested, payment promised, etc.) for easy follow-up.' },
              { q: 'Does it support Indian businesses?', a: 'Yes — Receptify is built specifically for Indian SMEs, with Hindi/English/Gujarati support and India-focused script templates.' },
              { q: 'Can I use this for cold calling?', a: 'No — Receptify is designed for legitimate customer communication only. Cold spam calling is not supported.' },
              { q: 'What industries can use this?', a: 'NBFCs, clinics, real-estate, gyms, D2C brands, coaching, local services and more. Any business that does repetitive customer reminders.' },
            ].map((f, i) => (
              <details key={i} className="glass p-5 group" data-testid={`faq-${i}`}>
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold text-brand-navy">{f.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding">
        <div className="container-max">
          <div className="glass-dark p-10 lg:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-10 w-80 h-80 rounded-full bg-brand-500/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-brand-700/50 blur-3xl" />
            <div className="relative">
              <span className="overline text-brand-100">Get started</span>
              <h2 className="mt-3 text-3xl lg:text-5xl font-extrabold tracking-tight">
                Replace manual calling with <span className="bg-gradient-to-r from-white to-brand-100 bg-clip-text text-transparent">Receptify</span>.
              </h2>
              <p className="mt-5 text-white/70 max-w-xl mx-auto">
                Start your free trial in minutes. No credit card needed.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/signup" className="btn-primary" data-testid="final-cta-signup">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="btn-ghost text-white hover:text-brand-100 hover:bg-white/10" data-testid="final-cta-login">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/50">
        <div className="container-max px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-slate-500">© 2026 Receptify · AI Voice Receptionist for Indian businesses.</p>
        </div>
      </footer>
    </main>
  );
}
