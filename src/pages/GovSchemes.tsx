import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Landmark, FileText, CheckCircle2, ArrowRight, Search } from 'lucide-react';

const schemes = [
  {
    id: 1,
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    category: 'Micro Finance',
    amount: 'Up to ₹10 Lakhs',
    interest: '8.5% - 12%',
    eligibility: ['Micro Enterprises', 'Non-Corporate', 'Non-Farm'],
    match: 95,
  },
  {
    id: 2,
    name: 'Stand-Up India Scheme',
    category: 'SC/ST/Women Entrepreneurs',
    amount: '₹10 Lakhs - ₹1 Crore',
    interest: 'Base Rate + 3%',
    eligibility: ['SC/ST Category', 'Women Entrepreneurs', 'Greenfield Enterprise'],
    match: 80,
  },
  {
    id: 3,
    name: 'Credit Guarantee Fund Trust (CGTMSE)',
    category: 'Collateral Free',
    amount: 'Up to ₹2 Crores',
    interest: 'Varies by Bank',
    eligibility: ['New MSMEs', 'Existing MSMEs', 'Manufacturing/Services'],
    match: 90,
  },
];

export const GovSchemes = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Government Schemes</h1>
          <p className="text-slate-400 mt-1">Discover subsidies and loans tailored for your business.</p>
        </div>
        <div className="relative w-full md:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Search schemes..."
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {schemes.map((scheme) => (
          <GlassCard key={scheme.id} hoverEffect className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
                <Landmark className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  {scheme.match}% Match
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{scheme.name}</h3>
            <p className="text-sm text-indigo-300 mb-4">{scheme.category}</p>
            
            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Loan Amount</span>
                <span className="font-medium text-white">{scheme.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Interest Rate</span>
                <span className="font-medium text-white">{scheme.interest}</span>
              </div>
              
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-2">Key Eligibility:</p>
                <ul className="space-y-1">
                  {scheme.eligibility.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button className="rounded-lg bg-white/5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                <FileText className="mr-2 h-4 w-4" /> Details
              </button>
              <button className="rounded-lg bg-indigo-500 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-400 transition-colors flex items-center justify-center">
                Apply <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
      
      <GlassCard className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Need help finding the right scheme?</h2>
            <p className="text-emerald-100/80 text-sm max-w-xl">
              Our AI advisor can analyze your business profile and recommend the best government schemes and subsidies you are eligible for.
            </p>
          </div>
          <button className="whitespace-nowrap rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
            Ask AI Advisor
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
