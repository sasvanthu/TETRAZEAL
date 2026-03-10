import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Sparkles, Send, RefreshCw, TrendingUp, AlertTriangle, CheckCircle2,
  Lightbulb, Bot, User, ChevronRight, Brain, Zap, Shield, BookOpen,
} from 'lucide-react';
import { api } from '../lib/api';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  suggestions?: string[];
  time: string;
}

const QUICK_ACTIONS = [
  { label: 'Analyze my loans', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Check scheme eligibility', icon: CheckCircle2, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { label: 'How to improve my score?', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { label: 'Next EMI due date?', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { label: 'Show cashflow insights', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { label: 'Document status check', icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
];

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function renderMessageText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') ? <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong> : p
  );
}

export const AIAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: "Hello! I'm your **FinZeal AI Advisor**. I have access to your financial data and can help you with loan analysis, EMI planning, government schemes, credit score improvement, and much more. What would you like to explore today?",
      suggestions: ['Analyze my loans', 'Check scheme eligibility', 'How to improve my score?'],
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getAISummary().then(setSummary).catch(() => null).finally(() => setSummaryLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), time: formatTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.chat(text.trim());
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: res.reply,
        suggestions: res.suggestions,
        time: formatTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "I'm having trouble connecting right now. Please ensure the backend server is running and try again.",
        time: formatTime(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const scoreColor = (s: number) => s >= 75 ? 'text-emerald-400' : s >= 50 ? 'text-amber-400' : 'text-rose-400';
  const scoreGlow = (s: number) => s >= 75 ? '0 0 20px rgba(16,185,129,0.4)' : s >= 50 ? '0 0 20px rgba(245,158,11,0.4)' : '0 0 20px rgba(244,63,94,0.4)';

  return (
    <div className="flex h-[calc(100vh-80px)] gap-6">
      {/* Left: Chat */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_16px_rgba(99,102,241,0.5)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                AI Financial Advisor
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              </h1>
              <p className="text-xs text-slate-500">Powered by FinZeal Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw className="h-3 w-3" /> Clear chat
          </button>
        </motion.div>

        {/* Messages */}
        <GlassCard className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === 'ai'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                }`}>
                  {msg.role === 'ai' ? <Sparkles className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'ai'
                      ? 'bg-white/5 border border-white/8 text-slate-200 rounded-tl-sm'
                      : 'bg-indigo-600/30 border border-indigo-500/30 text-white rounded-tr-sm'
                  }`}>
                    {renderMessageText(msg.text)}
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(s)}
                          className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-600">{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/8 bg-white/5 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </GlassCard>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.label}
              onClick={() => sendMessage(qa.label)}
              disabled={loading}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 disabled:opacity-50 ${qa.bg} ${qa.color}`}
            >
              <qa.icon className="h-3 w-3" />
              {qa.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="mt-3 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your finances..."
            disabled={loading}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Right: Financial Summary Panel */}
      <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Financial Health Score</h2>
            </div>
            {summaryLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-24 w-24 rounded-full bg-white/10 mx-auto" />
                <div className="h-3 bg-white/10 rounded" />
                <div className="h-3 bg-white/10 rounded w-3/4" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center py-3">
                  <div
                    className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/10"
                    style={{ boxShadow: scoreGlow(summary?.score || 75) }}
                  >
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={summary?.score >= 75 ? '#10b981' : summary?.score >= 50 ? '#f59e0b' : '#f43f5e'}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(summary?.score || 75) * 2.64} 264`}
                      />
                    </svg>
                    <span className={`text-2xl font-bold ${scoreColor(summary?.score || 75)}`}>
                      {summary?.score || 75}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">out of 100</p>
                </div>
                {summary?.metrics && (
                  <div className="space-y-2 mt-2">
                    {Object.entries(summary.metrics as Record<string, number>).slice(0, 4).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-white font-medium">{Math.round(val as number)}</span>
                        </div>
                        <AnimatedProgress value={val as number} color="bg-indigo-400" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">AI Insights</h2>
            </div>
            {summaryLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-white/5 rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {(summary?.insights || [
                  'Complete pending modules to unlock better rates',
                  'Your EMI-to-income ratio looks healthy',
                  'Upload missing documents to boost score',
                ]).map((ins: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(ins)}
                    className="w-full text-left flex items-start gap-2 rounded-lg border border-white/8 bg-white/3 p-2.5 text-xs text-slate-300 hover:bg-white/8 hover:text-white transition-all group"
                  >
                    <ChevronRight className="h-3 w-3 text-amber-400 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    {ins}
                  </button>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Ask About</h2>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              {[
                'Loan prepayment strategies',
                'Reducing interest burden',
                'Documents needed for Mudra loan',
                'What is CGTMSE scheme?',
                'How to increase decision score',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all truncate"
                >
                  • {q}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};
