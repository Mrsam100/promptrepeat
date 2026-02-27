'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ScrollReveal from '@/components/ScrollReveal';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  async function handleNewsletter(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubscribed(true);
    setEmail('');
  }

  return (
    <footer className="py-24 px-6 border-t border-black/5 bg-surface relative overflow-hidden">
      {/* Decorative floating orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/5 blur-3xl animate-float-delayed pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <Logo className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className="font-display text-2xl font-medium text-ink">PromptRepeat</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold">Intelligence Layer</span>
                </div>
              </div>
              <p className="text-ink/40 max-w-sm leading-relaxed font-body font-light mb-8">
                The universal prompt optimization layer for enterprise AI. Improve accuracy, reduce errors, and scale with confidence.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="max-w-sm">
                <div className="text-[10px] uppercase tracking-widest text-ink/40 font-bold mb-4">Stay Updated</div>
                {subscribed ? (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm text-primary font-medium py-3"
                  >
                    Thanks for subscribing!
                  </motion.p>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="email@company.com"
                      className="flex-grow px-4 py-3 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 transition-all text-sm font-body"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-ink text-surface text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all"
                    >
                      Join
                    </motion.button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <div>
              <h5 className="font-bold text-xs mb-8 uppercase tracking-[0.3em] text-ink/80">Product</h5>
              <ul className="space-y-5 text-sm text-ink/40 font-medium">
                {[
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/features', label: 'Features' },
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/docs', label: 'API Reference' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors inline-flex items-center group">
                      {link.label}
                      <span className="inline-block w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary ml-0 group-hover:ml-1">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div>
              <h5 className="font-bold text-xs mb-8 uppercase tracking-[0.3em] text-ink/80">Company</h5>
              <ul className="space-y-5 text-sm text-ink/40 font-medium">
                {[
                  { href: '/about', label: 'About' },
                  { href: '/privacy', label: 'Privacy' },
                  { href: '/terms', label: 'Terms' },
                  { href: '/contact', label: 'Contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors inline-flex items-center group">
                      {link.label}
                      <span className="inline-block w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-primary ml-0 group-hover:ml-1">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-12 border-t border-black/5">
            <p className="text-sm text-ink/30 font-medium">&copy; {new Date().getFullYear()} PromptRepeat. All rights reserved.</p>
            <div className="flex gap-10 text-sm text-ink/30 font-bold uppercase tracking-widest">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                <motion.a
                  key={social}
                  href={`https://${social.toLowerCase()}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {social}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-ink transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
