import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { User, Mail, Phone, MapPin, Shield, Bell, Key, LogOut, Save, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

export const Settings = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', location: '', business_type: '', language: 'en' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api.getProfile().catch(() => null).then((data) => {
      if (data) setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '', location: data.location || '', business_type: data.business_type || '', language: data.language || 'en' });
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ name: profile.name, phone: profile.phone, location: profile.location, business_type: profile.business_type, language: profile.language });
      toast.success('Profile saved!', 'Your changes have been saved successfully');
    } catch {
      toast.error('Save failed', 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pw.current || !pw.newPw) { toast.warning('Fill in all password fields'); return; }
    if (pw.newPw !== pw.confirm) { toast.error('Passwords do not match'); return; }
    if (pw.newPw.length < 6) { toast.warning('New password must be at least 6 characters'); return; }
    setChangingPw(true);
    try {
      await api.changePassword(pw.current, pw.newPw);
      toast.success('Password changed!');
      setShowPwForm(false);
      setPw({ current: '', newPw: '', confirm: '' });
    } catch (e: any) {
      toast.error('Password change failed', e.message);
    } finally {
      setChangingPw(false);
    }
  };

  const initials = profile.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account preferences and security.</p>
        </div>
        <button onClick={load} disabled={loading} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-all disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile card */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
            <div className="flex items-center gap-6 mb-7">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  {loading ? '?' : initials}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{loading ? '...' : profile.name || 'Your Name'}</h3>
                <p className="text-slate-400 text-sm">{profile.business_type || 'Business Owner'}</p>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><Shield className="h-3 w-3" /> Verified Account</p>
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-white/5 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
                  { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your@email.com' },
                  { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
                  { key: 'location', label: 'Business Location', icon: MapPin, type: 'text', placeholder: 'City, State' },
                ].map(({ key, label, icon: Icon, type, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">{label}</label>
                    <div className="relative">
                      <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={type} value={(profile as any)[key]}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Business Type</label>
                  <select
                    value={profile.business_type} onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
                    className="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {['Retail', 'Manufacturing', 'Services', 'Agriculture', 'Handicraft', 'Food & Beverage', 'Other'].map((t) => (
                      <option key={t} value={t} className="bg-slate-900">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Language</label>
                  <select
                    value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {[['en','English'], ['hi','Hindi'], ['ta','Tamil'], ['te','Telugu'], ['mr','Marathi'], ['gu','Gujarati']].map(([v, l]) => (
                      <option key={v} value={v} className="bg-slate-900">{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-400 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </GlassCard>

          {/* Security */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-5">Security & Privacy</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400"><Key className="h-5 w-5" /></div>
                    <div>
                      <h3 className="font-medium text-white">Change Password</h3>
                      <p className="text-xs text-slate-400">Update your account password</p>
                    </div>
                  </div>
                  <button onClick={() => setShowPwForm(!showPwForm)} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    {showPwForm ? 'Cancel' : 'Update'}
                  </button>
                </div>
                {showPwForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3">
                    {[
                      { key: 'current', label: 'Current Password' },
                      { key: 'newPw', label: 'New Password' },
                      { key: 'confirm', label: 'Confirm New Password' },
                    ].map(({ key, label }) => (
                      <div key={key} className="relative">
                        <label className="mb-1 block text-xs text-slate-400">{label}</label>
                        <div className="relative">
                          <input
                            type={showPw ? 'text' : 'password'}
                            value={(pw as any)[key]}
                            onChange={(e) => setPw({ ...pw, [key]: e.target.value })}
                            placeholder={label}
                            className="block w-full rounded-xl border border-white/10 bg-black/20 py-2 pl-4 pr-10 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          />
                          <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleChangePassword}
                      disabled={changingPw}
                      className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {changingPw ? 'Changing...' : 'Change Password'}
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400"><Shield className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-400">Extra security layer for your account</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-emerald-500/30"></div>
                </label>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <GlassCard>
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-indigo-400" /> Notifications</h2>
            <div className="space-y-4">
              {[
                { title: 'EMI Reminders', desc: 'Before due dates', df: true },
                { title: 'Loan Updates', desc: 'Application status changes', df: true },
                { title: 'New Schemes', desc: 'Eligible government schemes', df: false },
                { title: 'Community Replies', desc: 'Replies to your posts', df: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked={item.df} />
                    <div className="peer h-5 w-9 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-500 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                  </label>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Danger Zone */}
          <GlassCard className="border-rose-500/30 bg-rose-500/5">
            <h2 className="text-base font-semibold text-white mb-3">Danger Zone</h2>
            <p className="text-xs text-slate-400 mb-4">Once you delete your account, there is no going back.</p>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/50 bg-rose-500/10 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500 hover:text-white">
              <LogOut className="h-4 w-4" /> Delete Account
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
