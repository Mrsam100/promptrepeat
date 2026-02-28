'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import {
  Zap,
  Shield,
  Repeat,
  Cpu,
  Globe,
  BrainCircuit,
} from 'lucide-react';

const features = [
  {
    title: "Adaptive Repetition",
    desc: "Our engine automatically determines the optimal repetition strategy based on task complexity and prompt length.",
    icon: <Repeat className="w-8 h-8" />,
    color: "text-primary",
    bg: "bg-primary/10",
    gradient: "from-primary/10 to-primary/5"
  },
  {
    title: "Neural Reasoning",
    desc: "Recursive self-correction mode that anchors logic and eliminates hallucinations through multi-pass verification.",
    icon: <BrainCircuit className="w-8 h-8" />,
    color: "text-accent",
    bg: "bg-accent/10",
    gradient: "from-accent/10 to-accent/5"
  },
  {
    title: "Alignment Guardrails",
    desc: "Real-time monitoring for safety, truthfulness, and helpfulness to ensure outputs stay within enterprise bounds.",
    icon: <Shield className="w-8 h-8" />,
    color: "text-retro-red",
    bg: "bg-retro-red/10",
    gradient: "from-retro-red/10 to-retro-red/5"
  },
  {
    title: "Intent Expansion",
    desc: "Unpacks latent user intent to provide the LLM with deeper context and implicit goals for better results.",
    icon: <Zap className="w-8 h-8" />,
    color: "text-retro-yellow",
    bg: "bg-retro-yellow/10",
    gradient: "from-retro-yellow/10 to-retro-yellow/5"
  },
  {
    title: "Latency Optimization",
    desc: "Parallel prefill processing ensures that repetition layers have minimal impact on Time-To-First-Token.",
    icon: <Cpu className="w-8 h-8" />,
    color: "text-ink",
    bg: "bg-black/5",
    gradient: "from-black/5 to-black/[0.02]"
  },
  {
    title: "Global Infrastructure",
    desc: "Model-agnostic layer that works seamlessly across OpenAI, Anthropic, Gemini, and Mistral providers.",
    icon: <Globe className="w-8 h-8" />,
    color: "text-primary",
    bg: "bg-primary/10",
    gradient: "from-primary/10 to-primary/5"
  }
];

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-surface relative">
      <Navbar />

      {/* Background decoration */}
      <div className="absolute top-40 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute top-[60%] left-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-float-delayed pointer-events-none" />

      <div className="pt-48 pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-8 border border-primary/20"
            >
              Capabilities
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl sm:text-6xl md:text-8xl font-display font-medium text-ink mb-8 tracking-tight"
            >
              Powerful <span className="text-primary">Intelligence.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-ink/60 max-w-2xl mx-auto font-body font-light leading-relaxed"
            >
              Explore the foundational layers that make PromptRepeat the most advanced prompt optimization engine for enterprise AI.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.08}>
                <TiltCard className="h-full">
                  <div className="p-10 mistral-card hover:border-primary/40 transition-all duration-500 group relative overflow-hidden h-full hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                    {/* Animated gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Shimmer sweep on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-8 relative z-10`}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl mb-4 text-ink font-medium relative z-10">{feature.title}</h3>
                    <p className="text-ink/60 leading-relaxed relative z-10 font-body font-light">{feature.desc}</p>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
