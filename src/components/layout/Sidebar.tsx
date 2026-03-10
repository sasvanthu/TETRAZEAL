import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  GraduationCap, 
  LineChart, 
  FileText, 
  Users, 
  Settings,
  Landmark,
  Zap,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Loan Management', path: '/loans', icon: Wallet },
  { name: 'Financial Literacy', path: '/training', icon: GraduationCap },
  { name: 'Smart Tools', path: '/tools', icon: LineChart },
  { name: 'Gov Schemes', path: '/schemes', icon: Landmark },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Community', path: '/community', icon: Users },
  { name: 'AI Advisor', path: '/ai-advisor', icon: Sparkles, highlight: true },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <div className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <h1 className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-xl font-bold text-transparent">
          FinZeal
        </h1>
        <span className="ml-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
          PRO
        </span>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-indigo-500/10 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.15)]'
                  : (item as any).highlight
                    ? 'text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  />
                )}
                <item.icon
                  className={cn(
                    'mr-3 h-4 w-4 shrink-0 transition-colors',
                    isActive
                      ? 'text-emerald-400'
                      : (item as any).highlight
                        ? 'text-indigo-400 group-hover:text-indigo-300'
                        : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                {item.name}
                {(item as any).highlight && !isActive && (
                  <span className="ml-auto rounded-full border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold text-indigo-400">AI</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="border-t border-white/10 p-3">
        <div className="rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              JS
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">John Sharma</p>
              <p className="truncate text-xs text-indigo-300">Sharma General Store</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Decision Score</span>
            <span className="text-xs font-bold text-emerald-400">85/100</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
