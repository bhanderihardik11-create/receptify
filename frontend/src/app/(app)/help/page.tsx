import { HelpCircle, Upload, Megaphone, Sparkles, BarChart3, ShieldCheck, FileStack } from 'lucide-react';

export default function HelpPage() {
  const items = [
    { icon: Upload, t: 'How to upload customers', d: 'Use the CSV upload flow or add customers manually. Required: name + phone.' },
    { icon: Megaphone, t: 'How to create a campaign', d: 'Pick purpose → audience → generate script → schedule → confirm compliance → launch.' },
    { icon: Sparkles, t: 'How to generate a script', d: 'Fill in purpose, business name, language and tone — AI generates polite Indian scripts.' },
    { icon: BarChart3, t: 'How to check results', d: 'Go to Call history or Analytics to see outcomes, durations and conversion rates.' },
    { icon: FileStack, t: 'How to use templates', d: 'Browse industry templates and copy the script into your campaign.' },
    { icon: ShieldCheck, t: 'Compliance best practices', d: 'Always confirm consent, follow calling-window restrictions, never use for cold spam.' },
  ];
  return (
    <div className="space-y-6 max-w-4xl" data-testid="help-page">
      <header>
        <span className="overline">Help center</span>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-navy">Get started with Receptify</h1>
        <p className="text-slate-500 text-sm mt-1">Quick guides to set you up for AI calling.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((it, i) => (
          <div key={i} className="glass p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white grid place-items-center shrink-0"><it.icon className="w-4 h-4" /></div>
            <div>
              <h3 className="font-bold text-brand-navy">{it.t}</h3>
              <p className="text-sm text-slate-500 mt-1">{it.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
