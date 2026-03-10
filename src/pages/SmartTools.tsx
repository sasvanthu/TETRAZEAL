import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { LineChart as LineChartIcon, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const cashflowData = [
  { name: 'Jan', in: 40000, out: 24000 },
  { name: 'Feb', in: 30000, out: 13980 },
  { name: 'Mar', in: 20000, out: 9800 },
  { name: 'Apr', in: 27800, out: 39080 },
  { name: 'May', in: 18900, out: 4800 },
  { name: 'Jun', in: 23900, out: 3800 },
  { name: 'Jul', in: 34900, out: 4300 },
];

export const SmartTools = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Smart Financial Tools</h1>
          <p className="text-slate-400 mt-1">AI-powered insights to optimize your business finances.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <LineChartIcon className="mr-2 h-5 w-5 text-indigo-400" />
                Cash Flow Analytics
              </h2>
              <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 outline-none focus:border-indigo-500">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashflowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="in" name="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="out" name="Expenses" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                <span className="text-sm text-slate-300">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-rose-500 mr-2" />
                <span className="text-sm text-slate-300">Expenses</span>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-6 sm:grid-cols-2">
            <GlassCard hoverEffect className="cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-amber-500/20 p-3 text-amber-400 transition-transform group-hover:scale-110">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="font-semibold text-white text-lg">Expense Tracker</h3>
              <p className="text-sm text-slate-400 mt-1">Categorize and monitor your daily business expenses automatically.</p>
            </GlassCard>

            <GlassCard hoverEffect className="cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-purple-500/20 p-3 text-purple-400 transition-transform group-hover:scale-110">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="font-semibold text-white text-lg">Credit Score Builder</h3>
              <p className="text-sm text-slate-400 mt-1">Actionable steps to improve your creditworthiness for better loans.</p>
            </GlassCard>
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <h2 className="text-lg font-semibold text-white mb-4">Financial Decision Score</h2>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-indigo-500/20">
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="transparent"
                    stroke="#4f46e5"
                    strokeWidth="8"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * 85) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">85</span>
                  <span className="block text-xs text-indigo-300">/100</span>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-emerald-400">Excellent Standing</p>
              <p className="mt-1 text-center text-xs text-indigo-200">
                Your business shows strong repayment capacity and healthy cash flow.
              </p>
            </div>
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Cash Flow Health</span>
                <span className="font-medium text-emerald-400">Strong</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Debt-to-Income</span>
                <span className="font-medium text-amber-400">Moderate</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Repayment History</span>
                <span className="font-medium text-emerald-400">Perfect</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-amber-500/30 bg-amber-500/5">
            <h2 className="text-lg font-semibold text-amber-400 flex items-center mb-2">
              <AlertTriangle className="mr-2 h-5 w-5" /> AI Alert
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We noticed a 15% drop in revenue this month compared to the last 3 months average. Consider delaying non-essential inventory purchases until cash flow stabilizes.
            </p>
            <button className="mt-4 w-full rounded-lg bg-amber-500/20 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/30 transition-colors">
              View Detailed Analysis
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
