import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { FileText, Upload, CheckCircle2, Clock, AlertCircle, Search, Filter, RefreshCw, X, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

const FALLBACK_DOCS = [
  { id: 1, name: 'Aadhaar Card', document_type: 'Identity Proof', status: 'verified', uploaded_at: '2026-10-12', file_size: '2.4 MB' },
  { id: 2, name: 'PAN Card', document_type: 'Identity Proof', status: 'verified', uploaded_at: '2026-10-12', file_size: '1.8 MB' },
  { id: 3, name: 'GST Registration', document_type: 'Business Proof', status: 'pending', uploaded_at: '2026-10-14', file_size: '4.1 MB' },
  { id: 4, name: 'Bank Statement (6M)', document_type: 'Income Proof', status: 'rejected', uploaded_at: '2026-10-10', rejection_reason: 'Blurry image', file_size: '8.5 MB' },
  { id: 5, name: 'ITR Acknowledgment', document_type: 'Income Proof', status: 'missing', uploaded_at: '-', file_size: '-' },
];

const DOC_TYPES = ['Identity Proof', 'Business Proof', 'Income Proof', 'Address Proof', 'Bank Statement', 'Other'];

export const Documents = () => {
  const [documents, setDocuments] = useState<any[]>(FALLBACK_DOCS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState(DOC_TYPES[0]);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api.getDocuments().catch(() => null).then((data) => {
      if (data && data.length > 0) setDocuments(data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = documents.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return d.name?.toLowerCase().includes(q) || d.document_type?.toLowerCase().includes(q) || d.status?.includes(q);
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    setShowUpload(true);
  };

  const handleUpload = async () => {
    if (!newName.trim()) { toast.warning('Enter a document name'); return; }
    setUploading(true);
    try {
      await api.uploadDocument({ name: newName.trim(), document_type: newType, file_path: '/uploads/demo.pdf', file_size: '2.0 MB', mime_type: 'application/pdf' });
      toast.success('Document uploaded!', `${newName} has been added to your vault`);
      setShowUpload(false); setNewName(''); setNewType(DOC_TYPES[0]);
      load();
    } catch {
      toast.error('Upload failed', 'Please try again');
    } finally {
      setUploading(false);
    }
  };

  const verified = documents.filter((d) => d.status === 'verified').length;
  const completion = documents.length > 0 ? Math.round((verified / documents.length) * 100) : 0;
  const pendingDocs = documents.filter((d) => d.status === 'missing' || d.status === 'rejected');

  const statusConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    verified: { label: 'Verified', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 className="mr-1 h-3 w-3" /> },
    pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <Clock className="mr-1 h-3 w-3" /> },
    rejected: { label: 'Rejected', cls: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: <AlertCircle className="mr-1 h-3 w-3" /> },
    missing: { label: 'Missing', cls: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: <AlertCircle className="mr-1 h-3 w-3" /> },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Document Vault</h1>
          <p className="text-slate-400 mt-1">Securely manage your KYC and business documents.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} disabled={loading} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-all disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:bg-indigo-400"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload New
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Upload Document</h2>
                <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <input
                  type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="Document name (e.g. Aadhaar Card)"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <select
                  value={newType} onChange={(e) => setNewType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  {DOC_TYPES.map((t) => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                </select>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8">
                  <Upload className="h-8 w-8 text-indigo-400 mb-2" />
                  <p className="text-sm text-slate-300 mb-1">Drop file here or</p>
                  <button className="rounded-lg bg-indigo-500/20 px-4 py-1.5 text-sm text-indigo-300 hover:bg-indigo-500/30 transition-colors">Browse</button>
                  <p className="text-xs text-slate-500 mt-2">PDF, JPG, PNG up to 10MB</p>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !newName.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Add to Vault'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Your Documents</h2>
              <div className="relative w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                  placeholder="Search..."
                />
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 bg-white/5 rounded-lg" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-white/5 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Document Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((doc) => {
                      const sc = statusConfig[doc.status] || statusConfig.missing;
                      return (
                        <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4 font-medium text-white">
                            <div className="flex items-center">
                              <FileText className="mr-3 h-4 w-4 text-indigo-400 shrink-0" />
                              <span className="line-clamp-1">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-400">{doc.document_type || doc.type}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${sc.cls}`}>
                              {sc.icon}{sc.label}
                            </span>
                            {doc.rejection_reason && <p className="text-[10px] text-rose-400 mt-1">{doc.rejection_reason}</p>}
                          </td>
                          <td className="px-4 py-4 text-slate-400 text-xs">
                            {doc.uploaded_at && doc.uploaded_at !== '-' ? new Date(doc.uploaded_at).toLocaleDateString('en-IN') : '-'}
                          </td>
                          <td className="px-4 py-4">
                            {(doc.status === 'missing' || doc.status === 'rejected') ? (
                              <button onClick={() => setShowUpload(true)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Upload</button>
                            ) : (
                              <button className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">View</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>

        <div className="space-y-6">
          {/* Drag Drop */}
          <GlassCard className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
            <h2 className="text-base font-semibold text-white mb-4">Quick Upload</h2>
            <div
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/20 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'}`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              <div className="rounded-full bg-indigo-500/20 p-4 text-indigo-400 mb-4">
                <Upload className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium text-white mb-1">Drag and drop files here</p>
              <p className="text-xs text-slate-400 mb-4">PDF, JPG, PNG up to 10MB</p>
              <button onClick={() => setShowUpload(true)} className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                Browse Files
              </button>
            </div>
          </GlassCard>

          {/* Readiness */}
          <GlassCard className="border-emerald-500/30">
            <h2 className="text-base font-semibold text-white mb-4">Document Readiness</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Profile Completion</span>
              <span className="text-sm font-bold text-emerald-400">{completion}%</span>
            </div>
            <AnimatedProgress value={completion} color="bg-emerald-500" />
            {pendingDocs.length > 0 ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-slate-400">Missing documents:</p>
                {pendingDocs.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center gap-2 text-xs">
                    <AlertCircle className="h-3 w-3 text-amber-400 shrink-0" />
                    <span className="text-amber-300">{d.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-emerald-400">All documents verified!</p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
