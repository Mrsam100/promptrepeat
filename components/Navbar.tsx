'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ['rgba(245,242,237,0.6)', 'rgba(245,242,237,0.95)']);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      style={{ backgroundColor: navBg }}
      className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl transition-all duration-500 ${scrolled ? 'shadow-lg shadow-black/[0.03]' : ''}`}
    >
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Logo className="w-10 h-10" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-medium tracking-tight text-ink group-hover:text-primary transition-colors">PromptRepeat</span>
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[8px] uppercase tracking-[0.3em] text-ink/40 font-bold overflow-hidden whitespace-nowrap"
            >
              Intelligence Layer
            </motion.span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <Link href={link.href} className="relative text-xs font-bold uppercase tracking-widest text-ink/60 hover:text-primary transition-colors group py-2">
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-ink/60 hover:text-ink transition-colors">Sign In</Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <Link
              href="/dashboard"
              className="bg-ink text-surface px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile hamburger with icon rotation */}
        <motion.button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={24} className="text-ink" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu size={24} className="text-ink" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu with staggered items */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden overflow-hidden border-t border-black/5 bg-surface/95 backdrop-blur-xl"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-bold uppercase tracking-widest text-ink/60 hover:text-primary transition-all py-3 hover:pl-2 duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4 border-t border-black/5 space-y-3"
              >
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-bold uppercase tracking-widest text-ink/60 hover:text-ink transition-colors py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center bg-ink text-surface px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
