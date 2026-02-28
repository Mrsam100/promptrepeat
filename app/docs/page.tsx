'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import { Terminal, Book, Code, Cpu, Zap, Shield } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const docSections = [
  {
    title: "Quick Start",
    desc: "Get up and running with PromptRepeat in under 5 minutes.",
    icon: <Zap className="w-6 h-6" />,
    href: "#quick-start"
  },
  {
    title: "API Reference",
    desc: "Detailed documentation for our REST API.",
    icon: <Code className="w-6 h-6" />,
    href: "#quick-start"
  },
  {
    title: "Optimization Modes",
    desc: "Learn about x2, x3, Adaptive, and Neural Reasoning modes.",
    icon: <Cpu className="w-6 h-6" />,
    href: "#quick-start"
  },
  {
    title: "SDKs & Libraries",
    desc: "TypeScript SDK for prompt optimization.",
    icon: <Terminal className="w-6 h-6" />,
    href: "#quick-start"
  },
  {
    title: "Best Practices",
    desc: "Strategies for maximizing accuracy while minimizing costs.",
    icon: <Book className="w-6 h-6" />,
    href: "#quick-start"
  },
  {
    title: "Security & Compliance",
    desc: "Overview of our data handling and security practices.",
    icon: <Shield className="w-6 h-6" />,
    href: "#quick-start"
  }
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-surface relative">
      <Navbar />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(26,26,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="pt-48 pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-8 border border-primary/20"
            >
              Documentation
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl sm:text-6xl md:text-8xl font-display font-medium text-ink mb-8 tracking-tight"
            >
              Developer <span className="text-primary">Portal.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-ink/60 max-w-2xl font-body font-light leading-relaxed"
            >
              Everything you need to integrate PromptRepeat into your AI stack.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section, i) => (
              <ScrollReveal key={section.title} delay={i * 0.08}>
                <motion.a
                  href={section.href}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}
                  className="block p-8 mistral-card hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                  {/* Gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 relative z-10"
                  >
                    {section.icon}
                  </motion.div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-medium text-ink mb-2 flex items-center gap-2">
                      {section.title}
                      <span className="inline-block w-0 overflow-hidden group-hover:w-5 transition-all duration-300 text-primary">&rarr;</span>
                    </h3>
                    <p className="text-sm text-ink/60 font-body font-light leading-relaxed">{section.desc}</p>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                </motion.a>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <div id="quick-start" className="mt-24 p-12 mistral-card bg-black/5 border border-black/5 rounded-[40px] scroll-mt-24 relative overflow-hidden group">
              {/* Subtle animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-display font-medium mb-4 text-ink">API Quick Start</h2>
                  <p className="text-ink/60 mb-8 font-body font-light">Initialize the client and run your first optimized prompt in seconds.</p>
                  <div className="p-6 rounded-2xl bg-ink text-surface font-mono text-sm overflow-x-auto relative">
                    {/* Terminal glow */}
                    <div className="absolute -inset-1 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="relative z-10 flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                      <div className="w-3 h-3 rounded-full bg-retro-red/80" />
                      <div className="w-3 h-3 rounded-full bg-retro-yellow/80" />
                      <div className="w-3 h-3 rounded-full bg-accent/80" />
                      <span className="ml-2 text-white/30 text-xs">index.ts</span>
                    </div>
                    <code className="block relative z-10">
                      <span className="text-primary">import</span> &#123; PromptEngine &#125; <span className="text-primary">from</span> <span className="text-accent">&apos;@promptrepeat/sdk&apos;</span>;<br /><br />
                      <span className="text-primary">const</span> engine = <span className="text-primary">new</span> PromptEngine(process.env.API_KEY);<br /><br />
                      <span className="text-primary">const</span> result = <span className="text-primary">await</span> engine.execute(<span className="text-accent">&quot;Extract dates...&quot;</span>, &#123; mode: <span className="text-accent">&apos;adaptive&apos;</span> &#125;);
                      <span className="animate-blink text-primary ml-0.5">|</span>
                    </code>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <motion.div whileHover={{ scale: 1.05, boxShadow: '0 10px 40px -10px rgba(26,26,26,0.3)' }} whileTap={{ scale: 0.95 }}>
                    <a href="/dashboard/playground" className="block w-full md:w-auto bg-ink text-surface px-10 py-4 rounded-xl font-bold hover:bg-primary transition-all text-center">
                      Try the Playground
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}
