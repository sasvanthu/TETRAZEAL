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
  Landmark
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
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-center border-b border-white/10 px-4">
        <h1 className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-2xl font-bold text-transparent">
          SmartLoan
        </h1>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 transition-colors',
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                  )}
                />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center rounded-xl bg-white/5 p-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-slate-400">Entrepreneur</p>
          </div>
        </div>
      </div>
    </div>
  );
};
