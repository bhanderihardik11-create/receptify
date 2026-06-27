'use client';

import { useEffect, useState } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { Users, Megaphone, PhoneCall, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const OUTCOME_COLORS: Record<string, string> = {
  interested: '#10B981',
  callback_requested: '#F59E0B',
  payment_promised: '#10B981',
  appointment_confirmed: '#10B981',
  not_interested: '#94A3B8',
  no_answer: '#CBD5E1',
  wrong_number: '#EF4444',
  failed: '#EF4444',
  pending: '#94A3B8',
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/analytics').then((r) => r.json()).then(setData); }, []);
  if (!data) return <div className="glass h-60 animate-pulse" />;
  const t = data.totals;
  return (
    <div className="space-y-6" data-testid="analytics-page">
      <header>
        <span className="overline">Analytics</span>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-navy">Calling performance</h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard label="Total calls" value={t.totalCalls} icon={PhoneCall} accent="primary" testId="an-total-calls" />
        <KpiCard label="Answer rate" value={`${data.answerRate}%`} icon={CheckCircle2} accent="success" testId="an-answer-rate" />
        <KpiCard label="Callback rate" value={`${data.callbackRate}%`} icon={RefreshCw} accent="warning" testId="an-callback-rate" />
        <KpiCard label="Failed rate" value={`${data.failedRate}%`} icon={AlertCircle} accent="danger" testId="an-failed-rate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass p-6 lg:col-span-2">
          <h3 className="font-bold text-brand-navy mb-4">Calls per day (last 14)</h3>
          {data.callsByDay?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.callsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #DBEAFE', borderRadius: 12 }} />
                <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No data yet.</p>}
        </div>
        <div className="glass p-6">
          <h3 className="font-bold text-brand-navy mb-4">Outcome breakdown</h3>
          {data.outcomes?.length ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={data.outcomes} dataKey="count" nameKey="outcome" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {data.outcomes.map((o: any, i: number) => <Cell key={i} fill={OUTCOME_COLORS[o.outcome] || '#94A3B8'} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {data.outcomes.map((o: any) => (
                  <div key={o.outcome} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: OUTCOME_COLORS[o.outcome] || '#94A3B8' }} />
                      <span className="text-slate-600 capitalize">{o.outcome.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="font-bold text-brand-navy">{o.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-slate-500">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}
