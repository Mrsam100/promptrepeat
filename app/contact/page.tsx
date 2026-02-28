'use client';

import { useState, FormEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.email || !form.message) return;

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error('Failed to submit');
      }
      setStatus('sent');
      setForm({ firstName: '', lastName: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  const contactItems = [
    { icon: <Mail />, label: "Email", value: "hello@promptrepeat.com" },
    { icon: <MessageSquare />, label: "Support", value: "support@promptrepeat.com" },
    { icon: <Globe />, label: "Office", value: "San Francisco, CA" }
  ];

  return (
    <main className="min-h-screen bg-surface relative">
      <Navbar />

      {/* Background orbs */}
      <motion.div
        className="absolute top-40 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-40 -left-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="pt-48 pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-8 border border-primary/20"
              >
                Get in Touch
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-6xl md:text-8xl font-display font-medium text-ink mb-8 tracking-tight"
              >
                Let&apos;s <span className="text-primary">Connect.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-ink/60 font-body font-light leading-relaxed mb-12"
              >
                Have questions about our technology or need help scaling your AI operations? Our team is here to help.
              </motion.p>

              <div className="space-y-8">
                {contactItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-6 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-primary transition-colors group-hover:bg-primary/10"
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-ink/40 font-bold mb-1">{item.label}</div>
                      <div className="text-lg text-ink font-medium">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="p-10 mistral-card bg-white shadow-2xl rounded-[40px] relative overflow-hidden"
              >
                <div className="absolute inset-0 retro-stripes opacity-5 pointer-events-none"></div>

                <AnimatePresence mode="wait">
                  {status === 'sent' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative z-10 flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                          />
                          <CheckCircle2 size={64} className="text-primary relative z-10" />
                        </div>
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-display font-medium text-ink mb-3 mt-8"
                      >
                        Message Sent!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-ink/50 font-body font-light mb-8"
                      >
                        We&apos;ll get back to you within 24 hours.
                      </motion.p>
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        onClick={() => setStatus('idle')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-xl border border-black/10 text-xs font-bold uppercase tracking-widest text-ink/60 hover:bg-black/5 transition-all"
                      >
                        Send Another
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6 relative z-10"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-2"
                        >
                          <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink"
                            placeholder="Jane"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="space-y-2"
                        >
                          <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink"
                            placeholder="Doe"
                          />
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink"
                          placeholder="jane@company.com"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="space-y-2"
                      >
                        <label className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Message</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink h-32 resize-none"
                          placeholder="How can we help?"
                        />
                      </motion.div>

                      <AnimatePresence>
                        {status === 'error' && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-retro-red font-medium"
                          >
                            Something went wrong. Please try again.
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <motion.button
                        type="submit"
                        disabled={status === 'sending'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 40px -10px rgba(255,90,31,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-5 rounded-xl bg-ink text-surface font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {status === 'sending' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full"
                          />
                        ) : (
                          <>
                            Send Message
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
