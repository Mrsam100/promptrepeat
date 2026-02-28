'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useRef } from 'react';

export default function AboutPage() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <main className="min-h-screen bg-surface relative">
      <Navbar />

      {/* Background orbs */}
      <div className="absolute top-60 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-40 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-float-delayed pointer-events-none" />

      <div className="pt-48 pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-8 border border-primary/20"
              >
                Our Mission
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl sm:text-6xl md:text-8xl font-display font-medium text-ink mb-8 tracking-tight"
              >
                Anchoring <span className="text-primary">Intelligence.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-ink/60 font-body font-light leading-relaxed mb-8"
              >
                PromptRepeat was founded on a simple observation: LLMs are powerful but fragile. As instructions grow in complexity, model focus degrades.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-ink/40 font-body font-light leading-relaxed"
              >
                We build the foundational layer that reinforces intent, anchors logic, and ensures that AI outputs are consistently aligned with human expectations. Our team of researchers and engineers is dedicated to solving the &quot;instruction drift&quot; problem for the world&apos;s most ambitious AI companies.
              </motion.p>
            </div>

            {/* Parallax image */}
            <div ref={imageRef} className="relative">
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="aspect-square rounded-[40px] bg-black/5 border border-black/5 overflow-hidden relative group"
              >
                <div className="absolute inset-0 retro-stripes opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
                <Image
                  src="https://picsum.photos/seed/about/800/800"
                  alt="Team"
                  fill
                  className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-accent/10 border border-accent/20"
                animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Stats with animated counters */}
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { label: "Founded", value: "2024", sub: "San Francisco, CA" },
              { label: "Team", value: "24", sub: "Researchers & Engineers" },
              { label: "Scale", value: "1B+", sub: "Tokens Optimized Daily" }
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}
                  className="p-10 mistral-card text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-sm font-bold uppercase tracking-[0.3em] text-ink/40 mb-4 relative z-10">{stat.label}</div>
                  <div className="text-6xl font-display font-medium text-ink mb-2 relative z-10">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <div className="text-sm text-ink/60 relative z-10">{stat.sub}</div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
