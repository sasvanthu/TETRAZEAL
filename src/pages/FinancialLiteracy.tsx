import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { PlayCircle, Award, Star, Lock, CheckCircle2 } from 'lucide-react';

const modules = [
  {
    id: 1,
    title: 'Loan Fundamentals',
    description: 'Understand interest rates, EMIs, and loan terms.',
    progress: 100,
    status: 'completed',
    duration: '45 mins',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Business Budgeting',
    description: 'Learn how to manage cash flow and track expenses.',
    progress: 40,
    status: 'in-progress',
    duration: '60 mins',
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Credit Score Secrets',
    description: 'How to build and maintain a healthy credit score.',
    progress: 0,
    status: 'locked',
    duration: '30 mins',
    rating: 4.7,
  },
  {
    id: 4,
    title: 'Government Schemes',
    description: 'Explore subsidies and grants for rural businesses.',
    progress: 0,
    status: 'locked',
    duration: '40 mins',
    rating: 4.9,
  },
];

export const FinancialLiteracy = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Financial Literacy</h1>
          <p className="text-slate-400 mt-1">Level up your business knowledge to unlock better loan rates.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-300">Current Level</p>
            <p className="text-xl font-bold text-indigo-400">Level 3: Entrepreneur</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-white">Learning Modules</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {modules.map((mod) => (
              <GlassCard key={mod.id} hoverEffect className={mod.status === 'locked' ? 'opacity-70' : ''}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`rounded-lg p-2 ${
                    mod.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    mod.status === 'in-progress' ? 'bg-indigo-500/20 text-indigo-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {mod.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                     mod.status === 'in-progress' ? <PlayCircle className="h-5 w-5" /> :
                     <Lock className="h-5 w-5" />}
                  </div>
                  <div className="flex items-center text-xs text-amber-400">
                    <Star className="mr-1 h-3 w-3 fill-current" /> {mod.rating}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">{mod.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{mod.description}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{mod.progress}% Complete</span>
                    <span>{mod.duration}</span>
                  </div>
                  <AnimatedProgress 
                    value={mod.progress} 
                    color={mod.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'} 
                  />
                </div>
                
                {mod.status !== 'locked' && (
                  <button className={`mt-4 w-full rounded-lg py-2 text-sm font-medium transition-all ${
                    mod.status === 'completed' 
                      ? 'bg-white/5 text-white hover:bg-white/10' 
                      : 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-400'
                  }`}>
                    {mod.status === 'completed' ? 'Review Module' : 'Continue Learning'}
                  </button>
                )}
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <h2 className="text-lg font-semibold text-white mb-4">Your Achievements</h2>
            <div className="space-y-4">
              {[
                { name: 'First Steps', desc: 'Completed first module', icon: '🎯' },
                { name: 'Budget Master', desc: 'Scored 100% in Budgeting', icon: '💰' },
                { name: 'Consistent Learner', desc: '3 day streak', icon: '🔥' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center space-x-3 rounded-xl bg-white/5 p-3">
                  <div className="text-2xl">{badge.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{badge.name}</p>
                    <p className="text-xs text-indigo-200">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Leaderboard</h2>
            <div className="space-y-3">
              {[
                { name: 'Ramesh K.', points: 2450, rank: 1 },
                { name: 'Sunita M.', points: 2100, rank: 2 },
                { name: 'You', points: 1850, rank: 3, isUser: true },
                { name: 'Abdul R.', points: 1600, rank: 4 },
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between rounded-lg p-2 ${user.isUser ? 'bg-indigo-500/20 border border-indigo-500/30' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-bold ${user.rank <= 3 ? 'text-amber-400' : 'text-slate-500'}`}>#{user.rank}</span>
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
