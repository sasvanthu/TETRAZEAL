import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  CalendarDays,
  ArrowRight,
  BookOpen,
  Wallet,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, John</h1>
          <p className="text-slate-400 mt-1">Here's your financial overview for today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <TrendingUp className="mr-2 h-4 w-4" />
            <span className="font-semibold">Decision Score: 85/100</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard hoverEffect>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Total Loan Amount</h3>
            <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
              <span className="text-lg font-bold">₹</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">₹5,00,000</div>
            <p className="mt-1 text-xs text-emerald-400 flex items-center">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
            </p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Remaining Balance</h3>
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">₹3,45,000</div>
            <div className="mt-2">
              <AnimatedProgress value={31} color="bg-emerald-500" />
              <p className="mt-1 text-xs text-slate-400 text-right">31% Paid</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Next EMI Due</h3>
            <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">₹12,500</div>
            <p className="mt-1 text-xs text-rose-400 flex items-center">
              <AlertCircle className="mr-1 h-3 w-3" /> Due in 5 days (15th Oct)
            </p>
          </div>
        </GlassCard>

        <GlassCard hoverEffect className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-indigo-200">Training Progress</h3>
            <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-300">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">Level 3</div>
            <div className="mt-2">
              <AnimatedProgress value={60} color="bg-indigo-400" />
              <p className="mt-1 text-xs text-indigo-200 text-right">2 modules to next level</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Repayment Analytics</h2>
            <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 outline-none focus:border-emerald-500">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h2 className="mb-4 text-lg font-semibold text-white">Upcoming Actions</h2>
            <div className="space-y-4">
              {[
                { title: 'Pay EMI', desc: '₹12,500 due on 15th Oct', icon: Wallet, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                { title: 'Complete Module', desc: 'Business Budgeting Basics', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                { title: 'Upload Document', desc: 'Updated GST Return', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-lg p-2 ${item.bg} ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/30">
            <h2 className="mb-2 text-lg font-semibold text-emerald-400">AI Advisor Tip</h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Based on your recent cash flow, you can prepay ₹10,000 this month to save ₹2,400 in interest over the loan tenure.
            </p>
            <button className="mt-4 w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]">
              Explore Prepayment
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
