import React from 'react';
import { Bell, Search, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

export const Topbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-xl">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-12 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="Search loans, schemes, or ask AI..."
          />
          <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-emerald-400 transition-colors">
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
        </button>
      </div>
    </header>
  );
};
