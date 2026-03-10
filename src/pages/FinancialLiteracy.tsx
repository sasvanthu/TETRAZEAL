import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { PlayCircle, Award, Star, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

const FALLBACK = [
  { id: 1, title: 'Loan Fundamentals', description: 'Understand interest rates, EMIs, and loan terms.', progress: 100, status: 'completed', duration_minutes: 45, rating: 4.8 },
  { id: 2, title: 'Business Budgeting', description: 'Learn how to manage cash flow and track expenses.', progress: 40, status: 'in-progress', duration_minutes: 60, rating: 4.9 },
  { id: 3, title: 'Credit Score Secrets', description: 'How to build and maintain a healthy credit score.', progress: 0, status: 'not_started', duration_minutes: 30, rating: 4.7 },
  { id: 4, title: 'Government Schemes', description: 'Explore subsidies and grants for rural businesses.', progress: 0, status: 'not_started', duration_minutes: 40, rating: 4.9 },
];

export const FinancialLiteracy = () => {
  const [modules, setModules] = useState<any[]>(FALLBACK);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.getModules().catch(() => null),
      api.getTrainingSummary().catch(() => null),
    ]).then(([mods, sum]) => {
      if (mods && mods.length > 0) setModules(mods);
      if (sum) setSummary(sum);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleProgress = async (mod: any) => {
    if (mod.status === 'completed') return;
    const newProgress = Math.min(100, (mod.progress || 0) + 20);
    try {
      await api.updateProgress(mod.id, newProgress);
      setModules((prev) => prev.map((m) => m.id === mod.id ? { ...m, progress: newProgress, status: newProgress >= 100 ? 'completed' : 'in_progress' } : m));
      toast.success(newProgress >= 100 ? 'Module completed!' : 'Progress updated!', `${mod.title} - ${newProgress}%`);
    } catch {
      toast.error('Could not update progress');
    }
  };

  const completed = modules.filter((m) => m.status === 'completed' || m.progress >= 100).length;
  const totalPct = modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0;
  const level = completed >= 4 ? 5 : completed >= 3 ? 4 : completed >= 2 ? 3 : completed >= 1 ? 2 : 1;
  const levelNames: Record<number, string> = { 1: 'Beginner', 2: 'Learner', 3: 'Entrepreneur', 4: 'Expert', 5: 'Master' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Financial Literacy</h1>
          <p className="text-slate-400 mt-1">Level up your business knowledge to unlock better loan rates.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={load} disabled={loading} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-all disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-400">Current Level</p>
            <p className="text-lg font-bold text-indigo-400">Level {level}: {levelNames[level]}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Learning Modules</h2>
            <span className="text-xs text-slate-400">{completed}/{modules.length} completed</span>
          </div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-48 rounded-2xl bg-white/5" />)}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map((mod, idx) => {
                const isCompleted = mod.status === 'completed' || mod.progress >= 100;
                const isInProgress = !isCompleted && (mod.status === 'in_progress' || mod.status === 'in-progress' || mod.progress > 0);
                const isLocked = !isCompleted && !isInProgress && idx > completed + 1;
                return (
                  <motion.div key={mod.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
                    <GlassCard hoverEffect className={isLocked ? 'opacity-60' : ''}>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`rounded-lg p-2 ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : isInProgress ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isInProgress ? <PlayCircle className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                        </div>
                        <div className="flex items-center text-xs text-amber-400">
                          <Star className="mr-1 h-3 w-3 fill-current" /> {mod.rating || 4.8}
                        </div>
                      </div>

                      <h3 className="text-base font-semibold text-white mb-1">{mod.title}</h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{mod.description}</p>

                      <div className="mt-auto">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>{mod.progress || 0}% Complete</span>
                          <span>{mod.duration_minutes || mod.duration || 30} mins</span>
                        </div>
                        <AnimatedProgress value={mod.progress || 0} color={isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'} />
                      </div>

                      {!isLocked && (
                        <button
                          onClick={() => handleProgress(mod)}
                          disabled={isCompleted}
                          className={`mt-4 w-full rounded-lg py-2 text-sm font-medium transition-all ${
                            isCompleted
                              ? 'bg-white/5 text-slate-400 cursor-default'
                              : 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-400'
                          }`}
                        >
                          {isCompleted ? 'Completed \u2713' : isInProgress ? 'Continue Learning' : 'Start Module'}
                        </button>
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <h2 className="text-base font-semibold text-white mb-4">Overall Progress</h2>
            <div className="flex flex-col items-center py-3">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-500/20">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" stroke="#6366f1" strokeWidth="8" strokeLinecap="round"
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * totalPct) / 100 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    strokeDasharray="264"
                  />
                </svg>
                <span className="text-2xl font-bold text-white">{totalPct}%</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{completed} of {modules.length} modules</p>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <h2 className="text-base font-semibold text-white mb-4">Achievements</h2>
            <div className="space-y-3">
              {[
                { name: 'First Steps', desc: 'Complete first module', icon: '\u{1F3AF}', unlocked: completed >= 1 },
                { name: 'Fast Learner', desc: 'Complete 2 modules', icon: '\u{1F4A1}', unlocked: completed >= 2 },
                { name: 'Budget Master', desc: 'Complete all modules', icon: '\u{1F4B0}', unlocked: completed >= 4 },
              ].map((badge, i) => (
                <div key={i} className={`flex items-center gap-3 rounded-xl p-3 ${badge.unlocked ? 'bg-white/8 border border-white/10' : 'opacity-40 bg-white/3'}`}>
                  <div className="text-2xl">{badge.unlocked ? badge.icon : '\u{1F512}'}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{badge.name}</p>
                    <p className="text-xs text-indigo-200">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-base font-semibold text-white mb-4">Leaderboard</h2>
            <div className="space-y-2">
              {[
                { name: 'Ramesh K.', points: 2450, rank: 1 },
                { name: 'Sunita M.', points: 2100, rank: 2 },
                { name: 'You', points: summary?.totalPoints || 1850, rank: 3, isUser: true },
                { name: 'Abdul R.', points: 1600, rank: 4 },
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 ${user.isUser ? 'bg-indigo-500/20 border border-indigo-500/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-6 ${user.rank <= 3 ? 'text-amber-400' : 'text-slate-500'}`}>#{user.rank}</span>
                    <span className={`text-sm ${user.isUser ? 'font-bold text-white' : 'text-slate-300'}`}>{user.name}</span>
                  </div>
                  <span className="text-xs font-medium text-indigo-300">{user.points} pts</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
