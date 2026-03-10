import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import {
  TrendingUp, AlertCircle, CheckCircle2, CalendarDays, ArrowRight,
  BookOpen, Wallet, FileText, Sparkles, RefreshCw,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { api } from '../lib/api';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } } },
};

const FALLBACK = {
  user: { name: 'John Doe', decision_score: 85 },
  loans: { totalLoanAmount: 500000, remainingBalance: 345000, paidPercent: 31 },
  nextEMI: { amount: 12500, due_date: '2026-10-15' },
  training: { completedModules: 2, totalModules: 4 },
  cashflow: [
    { month: '2026-01', inflow: 40000, outflow: 24000 },
    { month: '2026-02', inflow: 38000, outflow: 22000 },
    { month: '2026-03', inflow: 45000, outflow: 27000 },
    { month: '2026-04', inflow: 42000, outflow: 30000 },
    { month: '2026-05', inflow: 50000, outflow: 25000 },
    { month: '2026-06', inflow: 55000, outflow: 28000 },
  ],
  pendingDocuments: 1,
};

export const Dashboard = () => {
  const [data, setData] = useState<any>(FALLBACK);
  const [tip, setTip] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.getDashboard().catch(() => null),
      api.getInsights().catch(() => null),
    ]).then(([dash, ins]) => {
      if (dash) setData(dash);
      if (ins?.advisorTip) setTip(ins.advisorTip);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const loans = data?.loans || FALLBACK.loans;
  const nextEMI = data?.nextEMI || FALLBACK.nextEMI;
  const training = data?.training || FALLBACK.training;
  const cashflow = data?.cashflow || FALLBACK.cashflow;
  const user = data?.user || FALLBACK.user;

  const chartData = cashflow.map((c: any) => ({
    name: c.month?.slice(5) || c.name,
    inflow: c.inflow || c.in || 0,
    outflow: c.outflow || c.out || 0,
  }));
  const trainingPct = training.totalModules > 0
    ? Math.round((training.completedModules / training.totalModules) * 100) : 60;
  const trainingLevel = training.completedModules >= 4 ? 5 : training.completedModules >= 2 ? 3 : 1;

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'John'} 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's your financial overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <motion.div
            animate={{ boxShadow: ['0 0 15px rgba(16,185,129,0.2)', '0 0 30px rgba(16,185,129,0.4)', '0 0 15px rgba(16,185,129,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            <span className="font-semibold text-sm">Score: {user?.decision_score || 85}/100</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={stagger.item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard hoverEffect>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Total Loan Amount</h3>
            <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400 text-lg font-bold">₹</div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">₹{(loans.totalLoanAmount || 500000).toLocaleString('en-IN')}</div>
            <p className="mt-2 flex items-center text-xs text-emerald-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Active &amp; Approved
            </p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Remaining Balance</h3>
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400"><TrendingUp className="h-5 w-5" /></div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">₹{(loans.remainingBalance || 345000).toLocaleString('en-IN')}</div>
            <div className="mt-2">
              <AnimatedProgress value={loans.paidPercent || 31} color="bg-emerald-500" />
              <p className="mt-1 text-right text-xs text-slate-400">{loans.paidPercent || 31}% Paid</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Next EMI Due</h3>
            <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400"><CalendarDays className="h-5 w-5" /></div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">₹{(nextEMI?.amount || 12500).toLocaleString('en-IN')}</div>
            <p className="mt-2 flex items-center text-xs text-rose-400">
              <AlertCircle className="mr-1 h-3 w-3" /> Due {nextEMI?.due_date || '15th Oct'}
            </p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-indigo-200">Training Progress</h3>
            <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-300"><BookOpen className="h-5 w-5" /></div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">Level {trainingLevel}</div>
            <div className="mt-2">
              <AnimatedProgress value={trainingPct} color="bg-indigo-400" />
              <p className="mt-1 text-right text-xs text-indigo-200">{training.totalModules - training.completedModules} modules left</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Chart + Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={stagger.item} className="lg:col-span-2">
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Cash Flow Analytics</h2>
                <p className="mt-0.5 text-xs text-slate-500">Monthly inflow vs outflow</p>
              </div>
              <div className="flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Inflow</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Outflow</span>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="inflow" name="Inflow" stroke="#10b981" strokeWidth={2} fill="url(#gradIn)" />
                  <Area type="monotone" dataKey="outflow" name="Outflow" stroke="#f43f5e" strokeWidth={2} fill="url(#gradOut)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={stagger.item} className="space-y-4">
          <GlassCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">Upcoming Actions</h2>
            <div className="space-y-2.5">
              {[
                { title: 'Pay EMI', desc: `₹${(nextEMI?.amount || 12500).toLocaleString('en-IN')} due ${nextEMI?.due_date || '15th Oct'}`, icon: Wallet, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                { title: 'Complete Module', desc: 'Business Budgeting – 40%', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                { title: 'Upload Document', desc: data?.pendingDocuments > 0 ? `${data.pendingDocuments} docs pending` : 'Profile complete ✓', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ x: 4 }} className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${item.bg} ${item.color}`}><item.icon className="h-4 w-4" /></div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/20">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/20 p-1.5 text-emerald-400"><Sparkles className="h-4 w-4" /></div>
              <h2 className="text-sm font-semibold text-emerald-300">AI Advisor</h2>
              <span className="ml-auto text-xs text-emerald-500/70">FinZeal AI</span>
            </div>
            <p className="text-sm leading-relaxed text-emerald-100/80">
              {tip || 'Based on your cash flow, consider a prepayment this month to save on interest charges.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-shadow"
            >
              Ask FinZeal AI →
            </motion.button>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};
