import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { FileText, Upload, CheckCircle2, Clock, AlertCircle, Search, Filter } from 'lucide-react';

const documents = [
  { id: 1, name: 'Aadhaar Card', type: 'Identity Proof', status: 'verified', date: '12 Oct 2026', size: '2.4 MB' },
  { id: 2, name: 'PAN Card', type: 'Identity Proof', status: 'verified', date: '12 Oct 2026', size: '1.8 MB' },
  { id: 3, name: 'GST Registration', type: 'Business Proof', status: 'pending', date: '14 Oct 2026', size: '4.1 MB' },
  { id: 4, name: 'Bank Statement (6M)', type: 'Income Proof', status: 'rejected', date: '10 Oct 2026', size: '8.5 MB', reason: 'Blurry image' },
  { id: 5, name: 'ITR Acknowledgment', type: 'Income Proof', status: 'missing', date: '-', size: '-' },
];

export const Documents = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Document Vault</h1>
          <p className="text-slate-400 mt-1">Securely manage your KYC and business documents.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </button>
          <button className="flex items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:bg-indigo-400">
            <Upload className="mr-2 h-4 w-4" /> Upload New
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Your Documents</h2>
              <div className="relative w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Search documents..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/5 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Document Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date Uploaded</th>
                    <th className="px-4 py-3 rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 font-medium text-white flex items-center">
                        <FileText className="mr-3 h-5 w-5 text-indigo-400" />
                        {doc.name}
                      </td>
                      <td className="px-4 py-4">{doc.type}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          doc.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          doc.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          doc.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                          {doc.status === 'verified' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {doc.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                          {doc.status === 'rejected' && <AlertCircle className="mr-1 h-3 w-3" />}
                          {doc.status === 'missing' && <AlertCircle className="mr-1 h-3 w-3" />}
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                        {doc.reason && <p className="text-[10px] text-rose-400 mt-1">{doc.reason}</p>}
                      </td>
                      <td className="px-4 py-4 text-slate-400">{doc.date}</td>
                      <td className="px-4 py-4">
                        {doc.status === 'missing' || doc.status === 'rejected' ? (
                          <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                            Upload
                          </button>
                        ) : (
                          <button className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Upload</h2>
            <div 
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/20 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="rounded-full bg-indigo-500/20 p-4 text-indigo-400 mb-4">
                <Upload className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium text-white mb-1">Drag and drop files here</p>
              <p className="text-xs text-slate-400 mb-4">PDF, JPG, PNG up to 10MB</p>
              <button className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                Browse Files
              </button>
            </div>
          </GlassCard>

          <GlassCard className="border-emerald-500/30">
            <h2 className="text-lg font-semibold text-white mb-4">Document Readiness</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Profile Completion</span>
              <span className="text-sm font-bold text-emerald-400">80%</span>
            </div>
            <div className="w-full overflow-hidden rounded-full bg-white/10 h-2 mb-4">
              <div className="h-full rounded-full bg-emerald-500 w-[80%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              You're almost ready to apply for a loan! Upload your <span className="text-amber-400 font-medium">ITR Acknowledgment</span> to complete your profile and unlock better interest rates.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
