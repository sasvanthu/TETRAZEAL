import React, { useState } from 'react';
import { Bell, Search, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const notifications = [
  { id: 1, title: 'EMI Due in 5 days', desc: '₹12,500 for Business Expansion Loan', time: '5d', color: 'text-rose-400', dot: 'bg-rose-500' },
  { id: 2, title: 'Document Rejected', desc: 'Bank Statement needs re-upload', time: '2d', color: 'text-amber-400', dot: 'bg-amber-500' },
  { id: 3, title: 'New Scheme Available', desc: 'PMMY Tarun – up to ₹10L at 9%', time: '1d', color: 'text-emerald-400', dot: 'bg-emerald-500' },
];

export const Topbar = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <header className="relative flex h-16 items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-xl">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
            placeholder="Search loans, schemes, documents..."
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* AI Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">AI Active</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
            </span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex items-start gap-3 rounded-xl p-3 hover:bg-white/5 transition-colors cursor-pointer">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${n.color}`}>{n.title}</p>
                        <p className="text-xs text-slate-400 truncate">{n.desc}</p>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">{n.time}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-2 w-full rounded-xl border border-white/10 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                  View all notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
