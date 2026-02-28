'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Pricing from '@/components/Pricing';
import { motion } from 'motion/react';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-surface relative">
      <Navbar />

      {/* Background orbs */}
      <div className="absolute top-40 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float-slow pointer-events-none" />

      <div className="pt-48 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold tracking-widest uppercase mb-8 border border-accent/20"
          >
            Flexible Plans
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-8xl font-display font-medium text-ink mb-8 tracking-tight"
          >
            Scale with <span className="text-accent">Confidence.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-ink/60 max-w-2xl mx-auto font-body font-light leading-relaxed mb-12"
          >
            Transparent pricing designed for developers and enterprises scaling AI operations.
          </motion.p>
        </div>
      </div>

      <Pricing />

      <ScrollReveal>
        <div className="pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="p-12 mistral-card bg-ink text-surface rounded-[40px] text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 retro-stripes opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <h2 className="text-4xl font-display font-medium mb-6 relative z-10">Need a custom solution?</h2>
              <p className="text-surface/60 mb-10 relative z-10">We offer tailored enterprise packages with dedicated support, custom SLAs, and on-premise deployment options.</p>
              <motion.div whileHover={{ scale: 1.05, boxShadow: '0 10px 40px -10px rgba(255,90,31,0.4)' }} whileTap={{ scale: 0.95 }} className="relative z-10">
                <Link href="/contact" className="inline-block bg-surface text-ink px-10 py-4 rounded-xl font-bold hover:bg-primary hover:text-white transition-all">
                  Contact Sales
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </ScrollReveal>

      <Footer />
    </main>
  );
}
