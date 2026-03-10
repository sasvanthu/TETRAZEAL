import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Landmark, FileText, CheckCircle2, ArrowRight, Search, RefreshCw, Filter, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const FALLBACK_SCHEMES = [
  { id: 1, name: 'Pradhan Mantri Mudra Yojana (PMMY)', category: 'Micro Finance', max_amount: 'Up to \u20b910 Lakhs', interest_rate: '8.5% - 12%', eligibility: 'Micro Enterprises, Non-Corporate, Non-Farm businesses', match_score: 95, description: 'Provides loans up to 10 Lakhs to non-corporate, non-farm small/micro enterprises.' },
  { id: 2, name: 'Stand-Up India Scheme', category: 'SC/ST/Women Entrepreneurs', max_amount: '\u20b910L - \u20b91 Crore', interest_rate: 'Base Rate + 3%', eligibility: 'SC/ST Category, Women Entrepreneurs, Greenfield Enterprise', match_score: 80, description: 'Facilitates bank loans for SC/ST and Women entrepreneurs.' },
  { id: 3, name: 'Credit Guarantee Fund Trust (CGTMSE)', category: 'Collateral Free', max_amount: 'Up to \u20b92 Crores', interest_rate: 'Varies by Bank', eligibility: 'New MSMEs, Existing MSMEs, Manufacturing/Services', match_score: 90, description: 'Provides collateral-free credit to MSME sector.' },
];

export const GovSchemes = () => {
  const [schemes, setSchemes] = useState<any[]>(FALLBACK_SCHEMES);
  const [filtered, setFiltered] = useState<any[]>(FALLBACK_SCHEMES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.getSchemes().catch(() => null),
      api.getSchemeCategories().catch(() => null),
    ]).then(([data, cats]) => {
      if (data && data.length > 0) {
        setSchemes(data);
        setFiltered(data);
      }
      if (cats && cats.length > 0) setCategories(['All', ...cats]);
      else setCategories(['All', 'Micro Finance', 'SC/ST/Women Entrepreneurs', 'Collateral Free']);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let result = schemes;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
    }
    if (category !== 'All') {
      result = result.filter((s) => s.category === category);
    }
    setFiltered(result);
  }, [search, category, schemes]);

  const getEligibilityList = (elig: string | string[]) => {
    if (Array.isArray(elig)) return elig;
    return (elig || '').split(',').map((e: string) => e.trim()).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Government Schemes</h1>
          <p className="text-slate-400 mt-1">Discover subsidies and loans tailored for your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Search schemes..."
            />
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                category === cat
                  ? 'bg-indigo-500/30 border-indigo-500/60 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassCard className="text-center py-12">
              <Landmark className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No schemes found for "{search}"</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-3 text-sm text-indigo-400 hover:text-indigo-300">Clear filters</button>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {filtered.map((scheme, idx) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <GlassCard hoverEffect className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
                      <Landmark className="h-6 w-6" />
                    </div>
                    {scheme.match_score && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        scheme.match_score >= 90 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        scheme.match_score >= 70 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                        'text-slate-400 bg-white/5 border-white/10'
                      }`}>
                        {scheme.match_score}% Match
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white mb-1 line-clamp-2">{scheme.name}</h3>
                  <p className="text-xs text-indigo-300 mb-3">{scheme.category}</p>

                  {scheme.description && (
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{scheme.description}</p>
                  )}

                  <div className="space-y-2.5 mb-5 flex-grow">
                    {scheme.max_amount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Loan Amount</span>
                        <span className="font-medium text-white text-right max-w-[55%]">{scheme.max_amount}</span>
                      </div>
                    )}
                    {scheme.interest_rate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Interest Rate</span>
                        <span className="font-medium text-white text-right max-w-[55%]">{scheme.interest_rate}</span>
                      </div>
                    )}

                    {scheme.eligibility && (
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-xs text-slate-400 mb-2">Key Eligibility:</p>
                        <ul className="space-y-1">
                          {getEligibilityList(scheme.eligibility).slice(0, 3).map((item: string, i: number) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 mr-2 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button className="rounded-lg bg-white/5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                      <FileText className="mr-2 h-4 w-4" /> Details
                    </button>
                    <button className="rounded-lg bg-indigo-500 py-2 text-sm font-medium text-white shadow-[0_0_12px_rgba(99,102,241,0.3)] hover:bg-indigo-400 transition-colors flex items-center justify-center">
                      Apply <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Need help finding the right scheme?</h2>
            <p className="text-emerald-100/80 text-sm max-w-xl">
              Our AI advisor can analyze your business profile and recommend the best government schemes you are eligible for.
            </p>
          </div>
          <button
            onClick={() => navigate('/ai-advisor')}
            className="flex items-center whitespace-nowrap rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Ask AI Advisor
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
