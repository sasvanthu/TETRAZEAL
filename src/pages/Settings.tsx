import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { User, Mail, Phone, MapPin, Shield, Bell, Key, LogOut } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account preferences and security.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-2 text-white shadow-lg hover:bg-emerald-400 transition-colors">
                  <User className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">John Doe</h3>
                <p className="text-slate-400">Retail Shop Owner</p>
                <p className="text-sm text-emerald-400 mt-1 flex items-center">
                  <Shield className="mr-1 h-4 w-4" /> Verified Account
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="block w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="block w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Phone Number</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="block w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Business Location</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    defaultValue="Mumbai, Maharashtra"
                    className="block w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="rounded-lg bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-400 transition-colors">
                Save Changes
              </button>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-6">Security & Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Change Password</h3>
                    <p className="text-xs text-slate-400">Update your account password</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Update
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-400">Add an extra layer of security</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/30"></div>
                </label>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              {[
                { title: 'EMI Reminders', desc: 'Get notified before due dates', active: true },
                { title: 'Loan Updates', desc: 'Status changes on applications', active: true },
                { title: 'New Schemes', desc: 'Alerts for eligible government schemes', active: false },
                { title: 'Community Mentions', desc: 'When someone replies to your post', active: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked={item.active} />
                    <div className="peer h-5 w-9 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-500 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                  </label>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="border-rose-500/30 bg-rose-500/5">
            <h2 className="text-lg font-semibold text-white mb-4">Danger Zone</h2>
            <p className="text-sm text-slate-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="flex w-full items-center justify-center rounded-lg border border-rose-500/50 bg-rose-500/10 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500 hover:text-white">
              <LogOut className="mr-2 h-4 w-4" /> Delete Account
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
