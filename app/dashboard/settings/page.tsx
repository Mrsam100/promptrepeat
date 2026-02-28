'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  User,
  ChevronRight,
  Check,
  Loader2
} from 'lucide-react';

export default function Settings() {
  const { data: session, update: updateSession } = useSession();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleEditProfile = () => {
    if (activePanel === 'profile') {
      setActivePanel(null);
    } else {
      setEditName(session?.user?.name || '');
      setActivePanel('profile');
      setSaveSuccess(false);
      setProfileError('');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setProfileError('');
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }
      setSaveSuccess(true);
      await updateSession();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      if (res.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        setDeleteError('Failed to delete account. Please try again.');
        setShowDeleteConfirm(false);
      }
    } catch {
      setDeleteError('Network error. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      {/* Profile Header */}
      <div className="flex items-center gap-8 p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden group">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-display font-medium border border-primary/20 relative z-10 shadow-sm overflow-hidden">
          {session?.user?.image ? (
            <Image src={session.user.image} alt={`${userName}'s avatar`} width={96} height={96} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-medium text-ink mb-2">{userName}</h2>
          <p className="text-sm text-ink/40 font-body font-light">{userEmail}</p>
        </div>
        <button
          onClick={handleEditProfile}
          className="ml-auto px-8 py-3 rounded-xl border border-black/5 bg-white/50 text-xs font-bold uppercase tracking-widest text-ink/60 hover:bg-black/5 transition-all relative z-10"
        >
          {activePanel === 'profile' ? 'Close' : 'Edit Profile'}
        </button>
      </div>

      {/* Edit Profile Panel */}
      <AnimatePresence>
        {activePanel === 'profile' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-10 mistral-card border border-black/5 shadow-sm space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink/20 mb-2">Edit Profile</h3>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-2 block">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={100}
                  className="w-full px-5 py-3 rounded-xl border border-black/10 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-2 block">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full px-5 py-3 rounded-xl border border-black/5 bg-black/5 text-ink/40 text-sm cursor-not-allowed"
                />
                <p className="text-[10px] text-ink/30 mt-1">Email cannot be changed.</p>
              </div>

              {profileError && (
                <p className="text-sm text-retro-red">{profileError}</p>
              )}

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-ink text-surface text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : saveSuccess ? <Check size={14} /> : null}
                  {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setActivePanel(null)}
                  className="px-8 py-3 rounded-xl border border-black/10 text-xs font-bold uppercase tracking-widest text-ink/60 hover:bg-black/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Groups — Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink/20 mb-8 ml-6">Account</h3>
        <div className="mistral-card rounded-[40px] border border-black/5 shadow-sm overflow-hidden relative">
          <button
            onClick={handleEditProfile}
            className={`w-full flex items-center gap-8 p-8 hover:bg-black/5 transition-all text-left relative z-10 group/item ${
              activePanel === 'profile' ? 'bg-black/5' : ''
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border border-black/5 ${
              activePanel === 'profile'
                ? 'bg-primary/10 text-primary'
                : 'bg-black/5 text-ink/40 group-hover/item:text-primary group-hover/item:bg-primary/10'
            }`}>
              <User size={22} />
            </div>
            <div className="flex-grow">
              <p className="font-bold text-ink mb-1 uppercase tracking-widest text-xs">Profile Information</p>
              <p className="text-sm text-ink/40 font-body font-light">Update your display name</p>
            </div>
            <ChevronRight size={20} className={`transition-all ${
              activePanel === 'profile' ? 'rotate-90 text-primary' : 'text-ink/10 group-hover/item:text-ink/40'
            }`} />
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <div className="p-10 rounded-[40px] bg-retro-red/5 border border-retro-red/10 relative overflow-hidden group">
        <h3 className="text-retro-red font-bold text-[10px] uppercase tracking-[0.3em] mb-4">Danger Zone</h3>
        <p className="text-sm text-ink/40 font-body font-light mb-8 leading-relaxed">Once you delete your account, there is no going back. All your data including prompt history will be permanently deleted.</p>

        {deleteError && !showDeleteConfirm && (
          <p className="text-sm text-retro-red mb-4">{deleteError}</p>
        )}

        {showDeleteConfirm ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-retro-red text-white text-xs font-bold uppercase tracking-widest hover:bg-retro-red/80 transition-all border border-retro-red disabled:opacity-50"
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-8 py-4 rounded-xl border border-black/10 text-xs font-bold uppercase tracking-widest text-ink/60 hover:bg-black/5 transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-8 py-4 rounded-xl bg-retro-red/10 text-retro-red text-xs font-bold uppercase tracking-widest hover:bg-retro-red hover:text-white transition-all border border-retro-red/20"
          >
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}
