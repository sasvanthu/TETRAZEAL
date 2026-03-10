import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import {
  Calculator, IndianRupee, Percent, Calendar, ArrowRight, Info,
  RefreshCw, Plus, X, CheckCircle2, AlertCircle, Wallet, Trash2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

export const LoanManagement = () => {
  // EMI Calculator state
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(24);

  // Live data state
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newLoan, setNewLoan] = useState({ lender_name: '', purpose: 'Working Capital', principal_amount: '', interest_rate: '', tenure_months: '', start_date: new Date().toISOString().slice(0, 10) });
  const [creating, setCreating] = useState(false);

  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api.getLoans().catch(() => null).then((data) => {
      if (data) setLoans(data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // EMI Calculation
  const monthlyRate = rate / 12 / 100;
  const emi = Math.round(
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
      : principal / tenure
  );
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - principal;
  const chartData = [
    { name: 'Principal', value: principal, color: '#10b981' },
    { name: 'Interest', value: totalInterest, color: '#6366f1' },
  ];

  const handleCreate = async () => {
    if (!newLoan.lender_name || !newLoan.principal_amount || !newLoan.interest_rate || !newLoan.tenure_months) {
      toast.warning('Please fill all required fields');
      return;
    }
    setCreating(true);
    try {
      await api.createLoan({
        lender_name: newLoan.lender_name,
        purpose: newLoan.purpose,
        principal_amount: Number(newLoan.principal_amount),
        interest_rate: Number(newLoan.interest_rate),
        tenure_months: Number(newLoan.tenure_months),
        start_date: newLoan.start_date,
      });
      toast.success('Loan added!', `${newLoan.lender_name} loan has been created`);
      setShowNew(false);
      setNewLoan({ lender_name: '', purpose: 'Working Capital', principal_amount: '', interest_rate: '', tenure_months: '', start_date: new Date().toISOString().slice(0, 10) });
      load();
    } catch (e: any) {
      toast.error('Failed to create loan', e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}" loan?`)) return;
    try {
      await api.deleteLoan(id);
      toast.success('Loan deleted');
      load();
    } catch {
      toast.error('Could not delete loan');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'closed') return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Loan Management</h1>
          <p className="text-slate-400 mt-1">Calculate, compare, and manage your business loans.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} disabled={loading} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-all disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400"
          >
            <Plus className="mr-2 h-4 w-4" /> Apply for New Loan
          </button>
        </div>
      </div>

      {/* New Loan Modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowNew(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Add New Loan</h2>
                <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Lender Name *</label>
                  <input type="text" value={newLoan.lender_name} onChange={(e) => setNewLoan({...newLoan, lender_name: e.target.value})}
                    placeholder="SBI, HDFC, Mudra..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Purpose</label>
                  <select value={newLoan.purpose} onChange={(e) => setNewLoan({...newLoan, purpose: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
                    {['Working Capital', 'Equipment', 'Expansion', 'Mudra', 'Agriculture', 'Other'].map((p) => (
                      <option key={p} value={p} className="bg-slate-900">{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Principal Amount (INR) *</label>
                  <input type="number" value={newLoan.principal_amount} onChange={(e) => setNewLoan({...newLoan, principal_amount: e.target.value})}
                    placeholder="500000" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Interest Rate (% p.a.) *</label>
                  <input type="number" step="0.1" value={newLoan.interest_rate} onChange={(e) => setNewLoan({...newLoan, interest_rate: e.target.value})}
                    placeholder="10.5" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tenure (Months) *</label>
                  <input type="number" value={newLoan.tenure_months} onChange={(e) => setNewLoan({...newLoan, tenure_months: e.target.value})}
                    placeholder="24" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
                  <input type="date" value={newLoan.start_date} onChange={(e) => setNewLoan({...newLoan, start_date: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {creating ? 'Creating...' : 'Create Loan'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* EMI Calculator */}
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Calculator className="h-32 w-32 text-emerald-500" /></div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-emerald-400" /> Smart EMI Calculator
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Loan Amount</label>
                    <span className="text-sm font-bold text-emerald-400">\u20b9{principal.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min="10000" max="1000000" step="10000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1"><span>10K</span><span>10L</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Interest Rate (% p.a.)</label>
                    <span className="text-sm font-bold text-indigo-400">{rate}%</span>
                  </div>
                  <input type="range" min="5" max="24" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-indigo-500" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1"><span>5%</span><span>24%</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Tenure (Months)</label>
                    <span className="text-sm font-bold text-purple-400">{tenure} mo</span>
                  </div>
                  <input type="range" min="6" max="60" step="6" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-purple-500" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1"><span>6m</span><span>5y</span></div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl bg-black/20 p-6 border border-white/5">
                <div className="text-center mb-5">
                  <p className="text-sm text-slate-400 mb-1">Monthly EMI</p>
                  <p className="text-4xl font-bold text-white">\u20b9{emi.toLocaleString('en-IN')}</p>
                </div>
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Principal</span>
                    <span className="font-medium text-emerald-400">\u20b9{principal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Interest</span>
                    <span className="font-medium text-indigo-400">\u20b9{totalInterest.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px w-full bg-white/10" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-300">Total Payable</span>
                    <span className="text-white">\u20b9{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Active Loans */}
          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-white">My Loans</h2>
              <span className="text-xs text-slate-400">{loans.length} loan{loans.length !== 1 ? 's' : ''}</span>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map((i) => <div key={i} className="h-28 bg-white/5 rounded-xl" />)}
              </div>
            ) : loans.length === 0 ? (
              <div className="text-center py-10">
                <Wallet className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No loans yet.</p>
                <button onClick={() => setShowNew(true)} className="mt-3 text-sm text-emerald-400 hover:text-emerald-300">+ Apply for your first loan</button>
              </div>
            ) : (
              <div className="space-y-4">
                {loans.map((loan) => {
                  const paid = loan.principal_amount - (loan.remaining_balance || loan.principal_amount);
                  const pct = loan.principal_amount > 0 ? Math.round((paid / loan.principal_amount) * 100) : 0;
                  const sc = getStatusColor(loan.status || 'active');
                  return (
                    <div key={loan.id} className={`rounded-xl border p-4 ${loan.status === 'active' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-white/3'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-white">{loan.lender_name || 'Unknown Lender'}</h3>
                          <p className="text-xs text-slate-400">{loan.purpose || 'Loan'} • {loan.interest_rate}% p.a.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${sc}`}>{loan.status || 'active'}</span>
                          <button onClick={() => handleDelete(loan.id, loan.lender_name)} className="text-slate-600 hover:text-rose-400 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-300">\u20b9{(loan.remaining_balance || loan.principal_amount).toLocaleString('en-IN')} left</span>
                        <span className="text-slate-400">of \u20b9{(loan.principal_amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <AnimatedProgress value={pct} color="bg-emerald-500" />
                      <p className="mt-1 text-right text-xs text-slate-500">{pct}% paid</p>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        <div className="space-y-6">
          {/* Pie chart */}
          <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <h2 className="text-base font-semibold text-white mb-4">Repayment Breakdown</h2>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => `\u20b9${Number(value).toLocaleString('en-IN')}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-[10px] text-slate-400">Total</span>
                <span className="text-base font-bold text-white">\u20b9{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-6">
              <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" /><span className="text-xs text-slate-300">Principal</span></div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-indigo-500 mr-2" /><span className="text-xs text-slate-300">Interest</span></div>
            </div>
          </GlassCard>

          {/* Compare offers */}
          <GlassCard>
            <h2 className="text-base font-semibold text-white mb-4">Compare Loan Offers</h2>
            <div className="space-y-3">
              {[
                { name: 'SBI', rate: '9.5%', fee: '1%', elig: 'High', color: 'text-emerald-400' },
                { name: 'HDFC Bank', rate: '10.2%', fee: '1.5%', elig: 'Medium', color: 'text-amber-400' },
                { name: 'Mudra Yojana', rate: '8.5%', fee: 'Nil', elig: 'Checking', color: 'text-indigo-400' },
              ].map((bank, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5 border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">{bank.name}</p>
                    <p className="text-xs text-slate-400">{bank.rate} p.a. • Fee: {bank.fee}</p>
                  </div>
                  <span className={`text-xs font-medium ${bank.color}`}>{bank.elig}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
