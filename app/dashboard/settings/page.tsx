'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import {
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Key,
  Database,
  Webhook,
  ChevronRight
} from 'lucide-react';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile Information', desc: 'Update your name, email and avatar' },
      { icon: Lock, label: 'Security', desc: 'Manage your password and 2FA' },
      { icon: Bell, label: 'Notifications', desc: 'Configure your alert preferences' },
    ]
  },
  {
    title: 'API & Integration',
    items: [
      { icon: Key, label: 'API Keys', desc: 'Manage your production and test keys' },
      { icon: Webhook, label: 'Webhooks', desc: 'Configure real-time event delivery' },
      { icon: Database, label: 'Data Residency', desc: 'Choose your storage region' },
    ]
  },
  {
    title: 'Organization',
    items: [
      { icon: Globe, label: 'Team Members', desc: 'Invite and manage your collaborators' },
      { icon: Shield, label: 'Compliance', desc: 'View SOC2 and GDPR documentation' },
    ]
  }
];

export default function Settings() {
  const { data: session } = useSession();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      {/* Profile Header */}
      <div className="flex items-center gap-8 p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden group">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-display font-medium border border-primary/20 relative z-10 shadow-sm overflow-hidden">
          {session?.user?.image ? (
            <img src={session.user.image} alt={`${userName}'s avatar`} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-medium text-ink mb-2">{userName}</h2>
          <p className="text-sm text-ink/40 font-body font-light uppercase tracking-widest font-bold">
            {userEmail}{userEmail && ' \u2022 '}Pro Plan
          </p>
        </div>
        <button
          onClick={() => setActivePanel(activePanel === 'profile' ? null : 'profile')}
          className="ml-auto px-8 py-3 rounded-xl border border-black/5 bg-white/50 text-xs font-bold uppercase tracking-widest text-ink/60 hover:bg-black/5 transition-all relative z-10"
        >
          Edit Profile
        </button>
      </div>

      {/* Settings Groups */}
      <div className="space-y-16">
        {settingsGroups.map((group, i) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink/20 mb-8 ml-6">{group.title}</h3>
            <div className="mistral-card rounded-[40px] border border-black/5 shadow-sm overflow-hidden relative">
              {group.items.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => setActivePanel(activePanel === item.label ? null : item.label)}
                  className={`w-full flex items-center gap-8 p-8 hover:bg-black/5 transition-all text-left relative z-10 group/item ${
                    index !== group.items.length - 1 ? 'border-b border-black/5' : ''
                  } ${activePanel === item.label ? 'bg-black/5' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border border-black/5 ${
                    activePanel === item.label
                      ? 'bg-primary/10 text-primary'
                      : 'bg-black/5 text-ink/40 group-hover/item:text-primary group-hover/item:bg-primary/10'
                  }`}>
                    <item.icon size={22} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-ink mb-1 uppercase tracking-widest text-xs">{item.label}</p>
                    <p className="text-sm text-ink/40 font-body font-light">{item.desc}</p>
                  </div>
                  <ChevronRight size={20} className={`transition-all ${
                    activePanel === item.label ? 'rotate-90 text-primary' : 'text-ink/10 group-hover/item:text-ink/40'
                  }`} />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="p-10 rounded-[40px] bg-retro-red/5 border border-retro-red/10 relative overflow-hidden group">
        <h3 className="text-retro-red font-bold text-[10px] uppercase tracking-[0.3em] mb-4">Danger Zone</h3>
        <p className="text-sm text-ink/40 font-body font-light mb-8 leading-relaxed">Once you delete your account, there is no going back. Please be certain.</p>

        {showDeleteConfirm ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                // TODO: Wire to actual account deletion API
                setShowDeleteConfirm(false);
              }}
              className="px-8 py-4 rounded-xl bg-retro-red text-white text-xs font-bold uppercase tracking-widest hover:bg-retro-red/80 transition-all border border-retro-red"
            >
              Yes, Delete My Account
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
