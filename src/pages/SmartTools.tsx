import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
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

      {/* HEADER */}

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

      {/* TOP CARDS */}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Avg Monthly Surplus', value: `₹${Math.abs(avgSurplus).toLocaleString('en-IN')}`, sub: avgSurplus >= 0 ? 'Positive cashflow' : 'Negative cashflow', color: avgSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400', bg: 'bg-emerald-500/10', icon: TrendingUp },
          { label: 'Total Inflow (6M)', value: `₹${totalInflow.toLocaleString('en-IN')}`, sub: 'Last 6 months', color: 'text-indigo-400', bg: 'bg-indigo-500/10', icon: Zap },
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

      {/* TOOLS SECTION */}

      <div className="grid gap-6 sm:grid-cols-2">

        {/* EMI CALCULATOR */}

        <GlassCard
          hoverEffect
          className="cursor-pointer group"
          onClick={() => navigate('/emi-calculator')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-amber-500/20 p-3 text-amber-400 transition-transform group-hover:scale-110">
              <TrendingUp className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>

          <h3 className="font-semibold text-white text-lg">
            EMI Calculator
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Calculate and compare EMIs across different loan scenarios.
          </p>
        </GlassCard>

        {/* CREDIT SCORE BUILDER */}

        <GlassCard
          hoverEffect
          className="cursor-pointer group"
          onClick={() => navigate('/ai-advisor')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-purple-500/20 p-3 text-purple-400 transition-transform group-hover:scale-110">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>

          <h3 className="font-semibold text-white text-lg">
            Credit Score Builder
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Get AI-powered actionable steps to improve your creditworthiness.
          </p>
        </GlassCard>

      </div>

    </div>
  );
};