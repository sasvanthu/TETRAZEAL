import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import {
  LineChart as LineChartIcon, TrendingUp, AlertTriangle, ArrowRight,
  ShieldCheck, RefreshCw, Sparkles, Zap, Target, ChevronRight,
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const FALLBACK_CASHFLOW = [
  { name: 'Jan', in: 40000, out: 24000 },
  { name: 'Feb', in: 30000, out: 13980 },
  { name: 'Mar', in: 45000, out: 28000 },
  { name: 'Apr', in: 38000, out: 30000 },
  { name: 'May', in: 52000, out: 25000 },
  { name: 'Jun', in: 48000, out: 29000 },
];

export const SmartTools = () => {
  const [cashflow, setCashflow] = useState<any[]>(FALLBACK_CASHFLOW);
  const [insights, setInsights] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.getCashflow(6).catch(() => null),
      api.getInsights().catch(() => null),
      api.getAISummary().catch(() => null),
    ]).then(([cf, ins, sum]) => {
      if (cf && cf.length > 0) {
        setCashflow(cf.map((c: any) => ({
          name: String(c.month || c.name || '').slice(-5).replace('-', '/'),
          in: c.inflow || c.in || 0,
          out: c.outflow || c.out || 0,
        })));
      }
      if (ins) setInsights(ins);
      if (sum) setSummary(sum);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const score = summary?.score ?? insights?.decisionScore ?? 85;
  const scoreColor = score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';
  const scoreLabel = score >= 75 ? 'Excellent Standing' : score >= 50 ? 'Fair Standing' : 'Needs Attention';
  const scoreStroke = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e';

  const totalInflow = cashflow.reduce((s, c) => s + c.in, 0);
  const totalOutflow = cashflow.reduce((s, c) => s + c.out, 0);
  const avgSurplus = Math.round((totalInflow - totalOutflow) / cashflow.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Smart Financial Tools</h1>
          <p className="text-slate-400 mt-1">AI-powered insights to optimize your business finances.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/ai-advisor')}
            className="flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition-all"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Ask AI Advisor
          </button>
          <button
            onClick={load}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Avg Monthly Surplus', value: `\u20b9${Math.abs(avgSurplus).toLocaleString('en-IN')}`, sub: avgSurplus >= 0 ? 'Positive cashflow' : 'Negative cashflow', color: avgSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400', bg: 'bg-emerald-500/10', icon: TrendingUp },
          { label: 'Total Inflow (6M)', value: `\u20b9${totalInflow.toLocaleString('en-IN')}`, sub: 'Last 6 months', color: 'text-indigo-400', bg: 'bg-indigo-500/10', icon: Zap },
          { label: 'Decision Score', value: `${score}/100`, sub: scoreLabel, color: scoreColor, bg: 'bg-purple-500/10', icon: Target },
        ].map((card) => (
          <GlassCard key={card.label} hoverEffect>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-400">{card.label}</span>
              <div className={`rounded-lg ${card.bg} p-2`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <LineChartIcon className="mr-2 h-5 w-5 text-indigo-400" />
                Cash Flow Analytics
              </h2>
              {loading && <RefreshCw className="h-4 w-4 text-slate-500 animate-spin" />}
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stGradIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="stGradOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `\u20b9${Math.round(v / 1000)}k`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(v: any) => [`\u20b9${Number(v).toLocaleString('en-IN')}`, undefined]}
                  />
                  <Area type="monotone" dataKey="in" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#stGradIn)" />
                  <Area type="monotone" dataKey="out" name="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#stGradOut)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Expenses</span>
            </div>
          </GlassCard>

          <div className="grid gap-6 sm:grid-cols-2">
            <GlassCard hoverEffect className="cursor-pointer group" onClick={() => navigate('/loans')}>
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-amber-500/20 p-3 text-amber-400 transition-transform group-hover:scale-110">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="font-semibold text-white text-lg">EMI Calculator</h3>
              <p className="text-sm text-slate-400 mt-1">Calculate and compare EMIs across different loan scenarios.</p>
            </GlassCard>

            <GlassCard hoverEffect className="cursor-pointer group" onClick={() => navigate('/ai-advisor')}>
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-purple-500/20 p-3 text-purple-400 transition-transform group-hover:scale-110">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="font-semibold text-white text-lg">Credit Score Builder</h3>
              <p className="text-sm text-slate-400 mt-1">Get AI-powered actionable steps to improve your creditworthiness.</p>
            </GlassCard>
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <h2 className="text-lg font-semibold text-white mb-4">Financial Decision Score</h2>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-indigo-500/20">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="46" fill="none"
                    stroke={scoreStroke}
                    strokeWidth="8" strokeLinecap="round"
                    initial={{ strokeDashoffset: 289 }}
                    animate={{ strokeDashoffset: 289 - (289 * score) / 100 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeDasharray="289"
                  />
                </svg>
                <div className="text-center">
                  <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
                  <span className="block text-xs text-indigo-300">/100</span>
                </div>
              </div>
              <p className={`mt-4 text-sm font-medium ${scoreColor}`}>{scoreLabel}</p>
            </div>
            <div className="mt-2 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Cash Flow</span>
                <span className={`font-medium ${avgSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{avgSurplus >= 0 ? 'Strong' : 'Weak'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Repayment</span>
                <span className="font-medium text-emerald-400">Perfect</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Documents</span>
                <span className="font-medium text-amber-400">Incomplete</span>
              </div>
            </div>
          </GlassCard>

          {insights?.advisorTip && (
            <GlassCard className="border-amber-500/30 bg-amber-500/5">
              <h2 className="text-base font-semibold text-amber-400 flex items-center mb-2">
                <AlertTriangle className="mr-2 h-4 w-4" /> AI Insight
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{insights.advisorTip}</p>
              <button
                onClick={() => navigate('/ai-advisor')}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500/20 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/30 transition-colors"
              >
                Ask AI for details <ChevronRight className="h-3 w-3" />
              </button>
            </GlassCard>
          )}

          {summary?.insights && (
            <GlassCard>
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" /> AI Recommendations
              </h2>
              <div className="space-y-2">
                {summary.insights.slice(0, 3).map((ins: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-white/3 rounded-lg p-2.5 border border-white/5">
                    <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                    {ins}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
