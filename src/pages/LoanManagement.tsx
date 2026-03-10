import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { Calculator, IndianRupee, Percent, Calendar, ArrowRight, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export const LoanManagement = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(24);

  // EMI Calculation: P * R * (1+R)^N / ((1+R)^N - 1)
  const monthlyRate = rate / 12 / 100;
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - principal;

  const chartData = [
    { name: 'Principal', value: principal, color: '#10b981' }, // Emerald
    { name: 'Interest', value: totalInterest, color: '#6366f1' }, // Indigo
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Loan Management</h1>
          <p className="text-slate-400 mt-1">Calculate, compare, and apply for business loans.</p>
        </div>
        <button className="flex items-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
          Apply for New Loan <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calculator className="h-32 w-32 text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-emerald-400" />
              Smart EMI Calculator
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                {/* Principal Input */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Loan Amount (₹)</label>
                    <span className="text-sm font-bold text-emerald-400">₹{principal.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="1000000" 
                    step="10000"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>10K</span>
                    <span>10L</span>
                  </div>
                </div>

                {/* Interest Rate Input */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Interest Rate (% p.a.)</label>
                    <span className="text-sm font-bold text-indigo-400">{rate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="24" 
                    step="0.5"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>5%</span>
                    <span>24%</span>
                  </div>
                </div>

                {/* Tenure Input */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Tenure (Months)</label>
                    <span className="text-sm font-bold text-purple-400">{tenure} mo</span>
                  </div>
                  <input 
                    type="range" 
                    min="6" 
                    max="60" 
                    step="6"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>6m</span>
                    <span>5y</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-black/20 p-6 border border-white/5">
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-400 mb-1">Your Monthly EMI</p>
                  <p className="text-4xl font-bold text-white tracking-tight">
                    ₹{emi.toLocaleString('en-IN')}
                  </p>
                </div>
                
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Principal Amount</span>
                    <span className="font-medium text-emerald-400">₹{principal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Interest</span>
                    <span className="font-medium text-indigo-400">₹{totalInterest.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px w-full bg-white/10 my-2" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-300">Total Payable</span>
                    <span className="text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4">Compare Loan Offers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/5 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Bank/NBFC</th>
                    <th className="px-4 py-3">Interest Rate</th>
                    <th className="px-4 py-3">Processing Fee</th>
                    <th className="px-4 py-3">Eligibility</th>
                    <th className="px-4 py-3 rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'State Bank of India', rate: '9.5%', fee: '1%', elig: 'High', color: 'text-emerald-400' },
                    { name: 'HDFC Bank', rate: '10.2%', fee: '1.5%', elig: 'Medium', color: 'text-amber-400' },
                    { name: 'Mudra Yojana', rate: '8.5%', fee: 'Nil', elig: 'Checking...', color: 'text-indigo-400' },
                  ].map((bank, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 font-medium text-white">{bank.name}</td>
                      <td className="px-4 py-4">{bank.rate}</td>
                      <td className="px-4 py-4">{bank.fee}</td>
                      <td className={`px-4 py-4 font-medium ${bank.color}`}>{bank.elig}</td>
                      <td className="px-4 py-4">
                        <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <h2 className="text-lg font-semibold text-white mb-4">Repayment Breakdown</h2>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xs text-slate-400">Total</span>
                <span className="text-lg font-bold text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                <span className="text-xs text-slate-300">Principal</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2" />
                <span className="text-xs text-slate-300">Interest</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Active Loans</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-emerald-400">Working Capital Loan</h3>
                    <p className="text-xs text-slate-400">A/c: XXXX-4589</p>
                  </div>
                  <span className="rounded bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">Active</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">₹1,55,000 left</span>
                    <span className="text-slate-400">of ₹5,00,000</span>
                  </div>
                  <AnimatedProgress value={69} color="bg-emerald-500" />
                </div>
                <button className="mt-4 w-full rounded-lg bg-white/5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                  View Schedule
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
