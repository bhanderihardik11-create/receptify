'use client';
import { useEffect, useState } from 'react';
import { FileStack, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { LANGUAGE_LABEL, PURPOSE_LABEL } from '@/lib/utils';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  useEffect(() => { fetch('/api/templates').then((r) => r.json()).then((d) => setTemplates(d.templates || [])); }, []);
  return (
    <div className="space-y-6" data-testid="templates-page">
      <header>
        <span className="overline">Pre-built scripts</span>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-navy">Templates</h1>
        <p className="text-slate-500 text-sm mt-1">Industry-ready calling scripts you can use instantly.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((t) => (
          <div key={t.id} className="glass p-5" data-testid={`template-${t.id}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="badge bg-brand-50 text-brand-700">{t.industry}</span>
              <span className="text-xs text-slate-500">{LANGUAGE_LABEL[t.language]}</span>
            </div>
            <h3 className="font-bold text-brand-navy mt-1">{t.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{PURPOSE_LABEL[t.purpose] || t.purpose}</p>
            <p className="text-sm text-slate-700 mt-3 line-clamp-4">{t.body}</p>
            <button onClick={() => { navigator.clipboard.writeText(t.body); toast.success('Copied'); }} className="btn-secondary text-xs mt-4" data-testid={`template-use-${t.id}`}>
              <Copy className="w-3 h-3" /> Copy script
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
