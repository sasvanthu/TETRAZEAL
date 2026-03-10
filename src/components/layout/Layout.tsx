import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AIChatAssistant } from '../ai/AIChatAssistant';
import { ToastProvider } from '../../contexts/ToastContext';
import { api } from '../../lib/api';

export const Layout = () => {
  useEffect(() => {
    if (!localStorage.getItem('finzeal_token')) {
      api.login('john@example.com', 'password123')
        .then((r: any) => localStorage.setItem('finzeal_token', r.token))
        .catch(console.warn);
    }
  }, []);

  return (
    <ToastProvider>
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Global background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] w-[20%] h-[20%] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      <div className="relative z-10 flex w-full">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Floating AI Chat */}
      <AIChatAssistant />
    </div>
    </ToastProvider>
  );
};
