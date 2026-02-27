'use client';

import { motion } from 'motion/react';
import { CreditCard, Check, Shield, Zap } from 'lucide-react';

export default function Billing() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-display font-medium text-ink mb-2">Current Plan</h3>
                <p className="text-sm text-ink/40 font-body font-light">You are currently on the Free plan.</p>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20">Active</span>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10 relative z-10">
              <div className="p-6 rounded-2xl bg-black/5 border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-2">Usage</p>
                <p className="text-xl font-display font-medium text-ink">842 / 1,000</p>
              </div>
              <div className="p-6 rounded-2xl bg-black/5 border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-2">Repetitions</p>
                <p className="text-xl font-display font-medium text-ink">x2 Only</p>
              </div>
              <div className="p-6 rounded-2xl bg-black/5 border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-2">Renewal</p>
                <p className="text-xl font-display font-medium text-ink">Mar 12</p>
              </div>
            </div>

            <button className="bg-primary text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm relative z-10">
              Upgrade to Pro
            </button>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden"
          >
            <h3 className="text-2xl font-display font-medium text-ink mb-8 relative z-10">Payment Methods</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-6 rounded-2xl border border-black/5 bg-black/5">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-10 bg-black/10 rounded-lg flex items-center justify-center text-[10px] font-bold text-ink/40 border border-black/5">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">Visa ending in 4242</p>
                    <p className="text-xs text-ink/40 font-body font-light">Expires 12/26</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors">Edit</button>
              </div>
              <button className="w-full py-5 rounded-2xl border border-dashed border-black/20 text-xs font-bold uppercase tracking-widest text-ink/40 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3">
                <CreditCard size={16} />
                Add New Method
              </button>
            </div>
          </motion.div>
        </div>

        {/* Plan Features */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[40px] bg-ink text-surface shadow-lg sticky top-8 overflow-hidden group"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
            
            <h3 className="text-3xl font-display font-medium mb-6 relative z-10">Benefits of upgrading.</h3>
            <p className="text-surface/70 text-sm mb-10 font-body font-light relative z-10 leading-relaxed">Enable the full potential of the repetition engine.</p>
            
            <ul className="space-y-5 mb-10 relative z-10">
              {[
                'Unlimited optimizations',
                'Adaptive repetition v2',
                'Custom segment targeting',
                'Priority API access',
                'Advanced analytics',
                'SLA guarantees'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-4 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check size={14} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 mb-10 relative z-10">
               <div className="flex items-center gap-4 mb-3">
                  <Shield size={20} className="text-surface" />
                  <p className="text-sm font-bold uppercase tracking-widest">Enterprise Grade</p>
               </div>
               <p className="text-xs text-surface/60 font-body font-light leading-relaxed">Over 500 startups trust PromptRepeat for production LLM workloads.</p>
            </div>

            <button className="w-full py-5 rounded-xl bg-surface text-ink font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-sm relative z-10">
              Go Pro Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
