import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { MessageSquare, Users, ThumbsUp, Share2, PlusCircle, Search, RefreshCw, X, Send } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

const FALLBACK_POSTS = [
  { id: 1, author_name: 'Sunita M.', author_role: 'Retail Shop Owner', title: 'How to manage inventory during festive season?', content: 'I usually face a cash crunch right before Diwali when I need to stock up. Any tips on managing working capital better?', like_count: 24, reply_count: 8, created_at: '2 hours ago', category: 'Working Capital', tags: 'Inventory,Working Capital' },
  { id: 2, author_name: 'Abdul R.', author_role: 'Handicraft Manufacturer', title: 'Experience with Mudra Loan application', content: 'Just got my Mudra loan approved! The process was much smoother than I expected. Happy to answer any questions about the documentation needed.', like_count: 45, reply_count: 12, created_at: '5 hours ago', category: 'Loans', tags: 'Mudra Loan,Success Story' },
  { id: 3, author_name: 'Priya K.', author_role: 'Tailoring Business', title: 'Best accounting app for small business?', content: 'I am currently tracking everything in a notebook but want to move to digital. What are some simple apps that work well on mobile?', like_count: 15, reply_count: 22, created_at: '1 day ago', category: 'Tools', tags: 'Tools,Accounting' },
];

const TOPICS = ['Working Capital', 'GST Returns', 'Marketing Tips', 'Loan Eligibility', 'Digital Payments'];

function getInitials(name: string) {
  return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

function timeAgo(dt: string) {
  if (!dt || dt.includes('ago')) return dt;
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const Community = () => {
  const [posts, setPosts] = useState<any[]>(FALLBACK_POSTS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCat, setNewCat] = useState('General');
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api.getPosts().catch(() => null).then((data) => {
      if (data && data.length > 0) setPosts(data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = posts.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q) || p.author_name?.toLowerCase().includes(q);
  });

  const handleLike = async (id: number) => {
    if (likedIds.has(id)) return;
    try {
      await api.likePost(id);
      setLikedIds((prev) => new Set([...prev, id]));
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, like_count: (p.like_count || 0) + 1 } : p));
    } catch {
      toast.error('Could not like post', 'Please try again');
    }
  };

  const handleNewPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) { toast.warning('Please fill in all fields'); return; }
    setSubmitting(true);
    try {
      await api.createPost({ title: newTitle.trim(), content: newContent.trim(), category: newCat });
      toast.success('Post created!', 'Your post is now live in the community');
      setShowNew(false);
      setNewTitle(''); setNewContent(''); setNewCat('General');
      load();
    } catch {
      toast.error('Failed to create post', 'Please ensure you are logged in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Entrepreneur Community</h1>
          <p className="text-slate-400 mt-1">Connect, learn, and grow with fellow business owners.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
            />
          </div>
          <button onClick={load} disabled={loading} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-all disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:bg-indigo-400"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> New Post
          </button>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowNew(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Create New Post</h2>
                <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <input
                  type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Post title..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <select
                  value={newCat} onChange={(e) => setNewCat(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  {['General', 'Loans', 'Working Capital', 'Tools', 'GST', 'Marketing', 'Success Story'].map((c) => (
                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
                <textarea
                  value={newContent} onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share your question or experience..."
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
                />
                <button
                  onClick={handleNewPost}
                  disabled={submitting || !newTitle.trim() || !newContent.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Posting...' : 'Post to Community'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {loading && posts.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="animate-pulse h-40 rounded-2xl bg-white/5" />)}
            </div>
          ) : filtered.length === 0 ? (
            <GlassCard className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No posts found for "{search}"</p>
            </GlassCard>
          ) : (
            filtered.map((post, idx) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <GlassCard hoverEffect>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]">
                      {getInitials(post.author_name || post.author || 'U')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-white">{post.author_name || post.author}</p>
                          <p className="text-xs text-slate-400">{post.author_role || post.role || 'Entrepreneur'}</p>
                        </div>
                        <span className="text-xs text-slate-500 shrink-0">{timeAgo(post.created_at || post.time)}</span>
                      </div>

                      <h3 className="mt-3 text-base font-semibold text-indigo-300 leading-snug">{post.title}</h3>
                      <p className="mt-1 text-sm text-slate-300 leading-relaxed line-clamp-3">{post.content}</p>

                      {(post.tags || post.category) && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(post.tags ? post.tags.split(',') : [post.category]).filter(Boolean).map((tag: string, i: number) => (
                            <span key={i} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400 border border-white/10">{tag.trim()}</span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-5 border-t border-white/10 pt-3">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center text-xs font-medium transition-colors ${likedIds.has(post.id) ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'}`}
                        >
                          <ThumbsUp className="mr-1.5 h-3.5 w-3.5" /> {post.like_count ?? post.likes ?? 0}
                        </button>
                        <button className="flex items-center text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                          <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> {post.reply_count ?? post.replies ?? 0} Replies
                        </button>
                        <button className="flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors ml-auto">
                          <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
            <h2 className="text-base font-semibold text-white mb-4">Expert Q&A Session</h2>
            <div className="rounded-xl bg-black/20 p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Tax Planning for MSMEs</p>
                  <p className="text-xs text-emerald-400">with CA Rajesh Kumar</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-4">Join our live session this Friday to understand GST compliance and tax saving tips.</p>
              <button className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-medium text-white shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-colors">
                Register for Free
              </button>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-base font-semibold text-white mb-4">Popular Topics</h2>
            <div className="space-y-1.5">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSearch(topic)}
                  className="w-full flex items-center justify-between rounded-lg px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <span className="text-sm text-slate-300 group-hover:text-white">#{topic}</span>
                  <span className="text-xs text-slate-500 group-hover:text-slate-400">{Math.floor(Math.random() * 50) + 10} posts</span>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-base font-semibold text-white mb-2">Community Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Members', value: '1,240+' },
                { label: 'Posts', value: `${posts.length}` },
                { label: 'Replies', value: `${posts.reduce((s, p) => s + (p.reply_count || 0), 0)}` },
                { label: 'Active Today', value: '89' },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-white/5 p-3 text-center border border-white/5">
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
