import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { MessageSquare, Users, ThumbsUp, Share2, PlusCircle } from 'lucide-react';

const discussions = [
  {
    id: 1,
    author: 'Sunita M.',
    role: 'Retail Shop Owner',
    avatar: 'SM',
    title: 'How to manage inventory during festive season?',
    content: 'I usually face a cash crunch right before Diwali when I need to stock up. Any tips on managing working capital better?',
    likes: 24,
    replies: 8,
    time: '2 hours ago',
    tags: ['Inventory', 'Working Capital'],
  },
  {
    id: 2,
    author: 'Abdul R.',
    role: 'Handicraft Manufacturer',
    avatar: 'AR',
    title: 'Experience with Mudra Loan application',
    content: 'Just got my Mudra loan approved! The process was much smoother than I expected. Happy to answer any questions about the documentation needed.',
    likes: 45,
    replies: 12,
    time: '5 hours ago',
    tags: ['Mudra Loan', 'Success Story'],
  },
  {
    id: 3,
    author: 'Priya K.',
    role: 'Tailoring Business',
    avatar: 'PK',
    title: 'Best accounting app for small business?',
    content: 'I am currently tracking everything in a notebook but want to move to digital. What are some simple apps that work well on mobile?',
    likes: 15,
    replies: 22,
    time: '1 day ago',
    tags: ['Tools', 'Accounting'],
  },
];

export const Community = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Entrepreneur Community</h1>
          <p className="text-slate-400 mt-1">Connect, learn, and grow with fellow business owners.</p>
        </div>
        <button className="flex items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:bg-indigo-400">
          <PlusCircle className="mr-2 h-4 w-4" /> New Post
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {discussions.map((post) => (
            <GlassCard key={post.id} hoverEffect className="transition-all hover:bg-white/10">
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{post.author}</p>
                      <p className="text-xs text-slate-400">{post.role}</p>
                    </div>
                    <span className="text-xs text-slate-500">{post.time}</span>
                  </div>
                  
                  <h3 className="mt-3 text-lg font-semibold text-indigo-300">{post.title}</h3>
                  <p className="mt-1 text-sm text-slate-300 leading-relaxed">{post.content}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-6 border-t border-white/10 pt-3">
                    <button className="flex items-center text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors">
                      <ThumbsUp className="mr-1.5 h-4 w-4" /> {post.likes}
                    </button>
                    <button className="flex items-center text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors">
                      <MessageSquare className="mr-1.5 h-4 w-4" /> {post.replies} Replies
                    </button>
                    <button className="flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors ml-auto">
                      <Share2 className="mr-1.5 h-4 w-4" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
            <h2 className="text-lg font-semibold text-white mb-4">Expert Q&A Session</h2>
            <div className="rounded-xl bg-black/20 p-4 border border-white/5">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Tax Planning for MSMEs</p>
                  <p className="text-xs text-emerald-400">with CA Rajesh Kumar</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-4">Join our live session this Friday to understand GST compliance and tax saving tips.</p>
              <button className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-colors">
                Register for Free
              </button>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Popular Topics</h2>
            <div className="space-y-2">
              {['Working Capital', 'GST Returns', 'Marketing Tips', 'Loan Eligibility', 'Digital Payments'].map((topic, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5 cursor-pointer transition-colors">
                  <span className="text-sm text-slate-300">#{topic}</span>
                  <span className="text-xs text-slate-500">{Math.floor(Math.random() * 50) + 10} posts</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
