'use client';

import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Pricing from '@/components/Pricing';
import Logo from '@/components/Logo';
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Cpu,
  Globe,
  Layers,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Search,
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Footer from '@/components/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    // Mouse parallax for the hero graphic
    const heroGraphic = document.querySelector(".hero-graphic");
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 50;
      const y = (clientY - window.innerHeight / 2) / 50;
      gsap.to(heroGraphic, { x, y, duration: 1, ease: "power2.out" });
    };
    if (heroGraphic) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // GSAP Animation for Hero
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(".hero-title",
        { opacity: 0, y: 100, rotateX: -30 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.5, ease: "expo.out", delay: 0.2 }
      )
      .fromTo(".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=1"
      )
      .fromTo(".hero-cta",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.5"
      );

      // Parallax fade-out for hero on scroll (no position shift)
      gsap.to(".hero-content", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".hero-content",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Scroll Triggered animations
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 50 }, 
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, heroRef);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <main ref={heroRef} className="min-h-screen bg-surface selection:bg-primary/20 selection:text-primary overflow-x-hidden relative">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 px-6 overflow-hidden">
        {/* Retro Stripes Background */}
        <div className="absolute top-0 right-0 w-1/3 h-full retro-stripes opacity-10 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="hero-content text-left">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-8 border border-primary/20"
              >
                <Sparkles size={12} />
                Recursive Intelligence Layer
              </motion.div>
              
              <h1 className="hero-title text-5xl sm:text-7xl md:text-[120px] mb-8 sm:mb-12 leading-[0.85] tracking-tighter font-display font-medium text-ink">
                Repeat <br />
                <span className="text-primary">to Align.</span>
              </h1>
              
              <p className="hero-subtitle text-xl text-ink/60 max-w-xl mb-12 font-body font-light leading-relaxed">
                PromptRepeat is a foundational intelligence layer. We combine recursive reasoning with superalignment guardrails to ensure LLM outputs are anchored in truth and logic.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link 
                  href="/dashboard" 
                  className="hero-cta group relative bg-ink text-surface px-10 py-5 rounded-xl text-lg font-bold transition-all shadow-sm flex items-center gap-4 overflow-hidden hover:bg-primary hover:text-white"
                >
                  <span>Get Started</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="px-10 py-5 rounded-xl text-lg font-bold border border-black/10 hover:bg-black/5 transition-all flex items-center gap-3 text-ink/80"
                >
                  Mechanism
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative z-10 hero-graphic"
              >
                {/* Pixel Cat Placeholder / Graphic */}
                <div className="w-full aspect-square bg-white border border-black/5 rounded-3xl shadow-2xl p-8 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 retro-stripes opacity-5 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="text-[120px] leading-none mb-4">🐈</div>
                    <div className="font-mono text-xs tracking-widest text-ink/40 uppercase">Recursive Agent v1.0</div>
                  </div>
                  
                  {/* Floating Pixel Elements */}
                  <motion.div 
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 w-12 h-12 bg-retro-yellow rounded-lg opacity-20"
                  />
                  <motion.div 
                    animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-10 left-10 w-16 h-16 bg-retro-red rounded-lg opacity-20"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="reveal-section py-24 px-6 border-y border-black/5 bg-black/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 relative z-10">
          {[
            { label: 'Accuracy Uplift', value: '30%', sub: 'Average increase', color: 'text-primary' },
            { label: 'Latency', value: '0ms', sub: 'Prefill processing', color: 'text-accent' },
            { label: 'Integrations', value: '50+', sub: 'LLM Providers', color: 'text-retro-red' },
            { label: 'Tokens Saved', value: '12%', sub: 'Adaptive pruning', color: 'text-ink' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center group">
              <div className={`text-4xl md:text-6xl font-display font-medium ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-500`}>{stat.value}</div>
              <div className="text-sm font-bold uppercase tracking-widest text-ink/60 mb-1">{stat.label}</div>
              <div className="text-xs text-ink/40">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Logos Section */}
      <section className="py-20 px-6 bg-surface border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30 mb-12">Trusted by the world&apos;s most ambitious AI teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {['Mistral', 'Anthropic', 'OpenAI', 'Meta', 'Google', 'Cohere'].map((logo) => (
              <div key={logo} className="text-2xl font-display font-bold text-ink tracking-tighter">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="reveal-section py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">The Mechanism</span>
              <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-ink">Universal Prompt <br />Optimization.</h2>
              <p className="text-lg text-ink/60 mb-12 font-body font-light leading-relaxed">
                Causal LLMs often lose focus on complex instructions. PromptRepeat injects a repetition layer that reinforces key segments without increasing output latency.
              </p>
              
              <div className="space-y-8">
                {[
                  { title: "Classification", desc: "Our engine identifies the task type (Extraction, Reasoning, Creative).", icon: <Search size={20} /> },
                  { title: "Transformation", desc: "We apply the optimal repetition strategy (x2, x3, or Selective).", icon: <Layers size={20} /> },
                  { title: "Execution", desc: "The engine sends the optimized prompt to your provider of choice.", icon: <Zap size={20} /> }
                ].map((step, i) => (
                  <div key={step.title} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl mb-2 text-ink font-medium">{step.title}</h4>
                      <p className="text-sm text-ink/60 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="mistral-card p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 retro-stripes opacity-5 pointer-events-none"></div>
                <div className="space-y-6 relative z-10">
                  <div className="p-4 rounded-xl bg-black/5 border border-black/5">
                    <div className="text-[10px] text-ink/40 uppercase tracking-widest mb-3">Original Prompt</div>
                    <div className="text-sm text-ink/60">Extract all dates from this text: &quot;The event is on Oct 12, 2024...&quot;</div>
                  </div>
                  <div className="flex justify-center">
                    <motion.div 
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg"
                    >
                      <ChevronRight size={20} />
                    </motion.div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-[10px] text-primary uppercase tracking-widest mb-3">Optimized (x2)</div>
                    <div className="text-sm text-ink/90 font-medium">
                      Extract all dates from this text: &quot;The event is on Oct 12, 2024...&quot;
                      <br /><br />
                      Extract all dates from this text: &quot;The event is on Oct 12, 2024...&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neural Reasoning Section */}
      <section className="reveal-section py-32 px-6 bg-ink text-surface overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_var(--color-accent)_0%,_transparent_50%)] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8 text-surface">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                      <BrainCircuit size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium">Neural Reasoning v2</h4>
                      <p className="text-xs text-surface/40">Recursive Self-Correction Engine</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-surface/40 uppercase tracking-widest mb-2">Pass 1: Initial Logic</div>
                      <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                      <div className="h-2 w-4/5 bg-white/10 rounded"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-accent to-transparent"></div>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                      <div className="text-[10px] text-accent uppercase tracking-widest mb-2">Pass 2: Self-Correction</div>
                      <div className="h-2 w-full bg-accent/20 rounded mb-2"></div>
                      <div className="h-2 w-5/6 bg-accent/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">Advanced Intelligence</span>
              <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-surface">Deep Reasoning. <br />Recursive Logic.</h2>
              <p className="text-lg text-surface/60 mb-12 font-body font-light leading-relaxed">
                Our Neural Reasoning mode uses multi-pass recursive self-correction to eliminate logical fallacies and hallucinations. It implements a System 2 thinking process directly into the prompt layer.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="text-2xl font-display mb-2 text-surface">98.4%</h5>
                  <p className="text-sm text-surface/40">Logical Consistency</p>
                </div>
                <div>
                  <h5 className="text-2xl font-display mb-2 text-surface">0.2%</h5>
                  <p className="text-sm text-surface/40">Hallucination Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="reveal-section py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl mb-6 text-ink font-medium">Built for every task.</h2>
            <p className="text-ink/60 max-w-2xl mx-auto">From simple classification to complex data extraction, repetition increases performance for all tasks.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Data Extraction", 
                icon: <Terminal />, 
                desc: "Ensure 100% recall on complex JSON extraction tasks from long-form documents.",
                color: "bg-accent"
              },
              { 
                title: "Classification", 
                icon: <CheckCircle2 />, 
                desc: "Reduce edge-case errors in sentiment analysis and intent classification by 22%.",
                color: "bg-retro-red"
              },
              { 
                title: "Creative Reasoning", 
                icon: <BrainCircuit />, 
                desc: "Reinforce style guidelines and constraints in multi-step creative generation.",
                color: "bg-primary"
              }
            ].map((useCase, i) => (
              <div key={useCase.title} className="p-10 mistral-card hover:border-primary/40 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-14 h-14 rounded-2xl ${useCase.color}/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform relative z-10`}>
                  {useCase.icon}
                </div>
                <h3 className="text-2xl mb-4 text-ink font-medium relative z-10">{useCase.title}</h3>
                <p className="text-ink/60 leading-relaxed relative z-10">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="reveal-section py-32 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-ink text-surface rounded-[48px] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
            
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-surface">Enterprise-grade <br />infrastructure.</h2>
              <div className="space-y-6">
                {[
                  "SOC2 Type II Compliant",
                  "99.99% Uptime SLA",
                  "Dedicated Support Engineer",
                  "Custom Deployment Options"
                ].map(text => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-surface/80 font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="inline-block mt-12 bg-surface text-ink px-10 py-5 rounded-xl text-lg font-bold hover:bg-primary hover:text-white transition-all">
                Talk to Sales
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[Zap, Globe, Shield, Cpu].map((Icon, i) => (
                <div key={i} className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-black/5 border border-black/5 flex items-center justify-center">
                  <Icon size={32} className="text-primary sm:w-10 sm:h-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison / Deep Dive Section */}
      <section className="reveal-section py-32 px-6 bg-surface relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-retro-red text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">The Benchmark</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl mb-8 leading-tight text-ink font-medium">Instruction Drift <br />is a Solved Problem.</h2>
            <p className="text-lg text-ink/60 max-w-2xl mx-auto font-body font-light leading-relaxed">
              Standard prompts lose 40% of their instructional weight after 200 tokens. PromptRepeat maintains 99.2% alignment through recursive anchoring.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="mistral-card p-10 bg-black/5 border-black/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-retro-red"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Standard Execution</span>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-ink/10 rounded"></div>
                <div className="h-4 w-full bg-ink/10 rounded"></div>
                <div className="h-4 w-3/4 bg-ink/10 rounded"></div>
                <div className="mt-8 p-6 bg-white rounded-xl border border-black/5">
                  <p className="text-sm text-ink/40">&quot;The model missed the formatting constraints and hallucinated the second date...&quot;</p>
                </div>
              </div>
            </div>

            <div className="mistral-card p-10 border-primary bg-primary/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">PromptRepeat Optimized</span>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-primary/20 rounded"></div>
                <div className="h-4 w-full bg-primary/20 rounded"></div>
                <div className="h-4 w-full bg-primary/20 rounded"></div>
                <div className="mt-8 p-6 bg-white rounded-xl border border-primary/20">
                  <p className="text-sm text-ink font-medium">&quot;Perfect extraction. All constraints followed. 100% logical consistency across all passes.&quot;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Section */}
      <section className="reveal-section py-32 px-6 bg-ink text-surface overflow-hidden relative">
        <div className="absolute inset-0 retro-stripes opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">Architecture</span>
              <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-surface font-medium">The Recursive <br />Inference Stack.</h2>
              <div className="space-y-12">
                {[
                  { title: "Latent Intent Expansion", desc: "We use a secondary model to unpack implicit user goals before the primary execution.", icon: <Zap /> },
                  { title: "Recursive Anchoring", desc: "Key instructions are injected at optimal attention intervals based on model-specific KV-cache dynamics.", icon: <Layers /> },
                  { title: "Superalignment Guardrails", desc: "Real-time output verification against a set of predefined truthfulness and safety tensors.", icon: <Shield /> }
                ].map((item, i) => (
                  <div key={item.title} className="flex gap-8 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl mb-3 text-surface font-medium">{item.title}</h4>
                      <p className="text-surface/50 leading-relaxed font-body font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-white/5 rounded-[48px] border border-white/10 p-12 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_var(--color-primary)_0%,_transparent_50%)] opacity-20"></div>
                <div className="space-y-8 relative z-10">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">System Status: Active</div>
                  <div className="space-y-4">
                    <div className="h-1 w-full bg-white/10 rounded overflow-hidden">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="h-full w-1/3 bg-primary"
                      />
                    </div>
                    <div className="h-1 w-4/5 bg-white/10 rounded overflow-hidden">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
                        className="h-full w-1/4 bg-accent"
                      />
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-6xl font-display font-bold text-surface mb-4 tracking-tighter">99.99%</div>
                  <div className="text-xs uppercase tracking-[0.3em] text-surface/40 font-bold">Uptime Reliability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="reveal-section py-32 px-6 bg-surface relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-ink font-medium">Loved by builders.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Alex Rivera", role: "CTO @ NeuralFlow", text: "PromptRepeat changed how we handle complex data extraction. Our error rates dropped by 40% overnight." },
              { name: "Sarah Chen", role: "Lead AI Engineer @ Vertex", text: "The adaptive repetition strategy is pure magic. It knows exactly when to reinforce instructions without wasting tokens." },
              { name: "Marcus Thorne", role: "Founder @ Synthia", text: "Finally, a tool that treats prompt engineering like the science it is. The neural reasoning mode is a game changer." }
            ].map((t, i) => (
              <div key={i} className="p-12 mistral-card bg-white border-black/5 hover:border-primary/20 transition-all group">
                <div className="text-4xl text-primary mb-8 leading-none">&quot;</div>
                <p className="text-lg text-ink/80 mb-10 font-body font-light leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black/5 border border-black/5 flex items-center justify-center font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-ink">{t.name}</div>
                    <div className="text-xs text-ink/40 uppercase tracking-widest font-bold">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Experience Section */}
      <section className="reveal-section py-32 px-6 bg-surface relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">Developer Experience</span>
              <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-ink font-medium">Built for <br />the terminal.</h2>
              <p className="text-lg text-ink/60 mb-12 font-body font-light leading-relaxed">
                PromptRepeat fits into your existing workflow with a powerful CLI and type-safe SDKs for every major language.
              </p>
              <div className="space-y-6">
                {[
                  "Type-safe SDKs for Python & TypeScript",
                  "Real-time streaming support",
                  "Local development proxy",
                  "CI/CD integration for prompt testing"
                ].map(text => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ChevronRight size={12} />
                    </div>
                    <span className="text-ink/80 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="mistral-card bg-ink p-1 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-retro-red"></div>
                  <div className="w-3 h-3 rounded-full bg-retro-yellow"></div>
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="ml-4 text-[10px] font-mono text-surface/40 uppercase tracking-widest">Terminal — promptrepeat-cli</span>
                </div>
                <div className="p-8 font-mono text-sm text-surface/80">
                  <div className="flex gap-4 mb-2">
                    <span className="text-primary">$</span>
                    <span>npm install -g promptrepeat-cli</span>
                  </div>
                  <div className="flex gap-4 mb-2">
                    <span className="text-primary">$</span>
                    <span>promptrepeat init</span>
                  </div>
                  <div className="flex gap-4 mb-6">
                    <span className="text-primary">$</span>
                    <span>promptrepeat deploy --mode adaptive</span>
                  </div>
                  <div className="text-primary/60 mb-2">✓ Configuration verified</div>
                  <div className="text-primary/60 mb-2">✓ Edge network connected</div>
                  <div className="text-primary font-bold">✓ Deployment successful: https://api.pr.ai/v1/opt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      {/* KV-Cache Optimization Section */}
      <section className="reveal-section py-32 px-6 bg-surface relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="mistral-card p-12 bg-ink text-surface rounded-[48px] overflow-hidden relative">
                <div className="absolute inset-0 retro-stripes opacity-5"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                      <Cpu size={24} />
                    </div>
                    <h4 className="text-xl font-medium">KV-Cache Dynamics</h4>
                  </div>
                  <div className="space-y-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-surface/40">Attention Weight</span>
                        <span className="text-primary font-mono text-xs">99.8%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
                        <motion.div 
                          animate={{ width: ['0%', '99.8%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-surface/60 leading-relaxed font-body font-light">
                      PromptRepeat leverages model-specific KV-cache dynamics to ensure that repeated instructions occupy high-attention slots in the transformer architecture.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">Performance</span>
              <h2 className="text-5xl md:text-6xl mb-8 leading-tight text-ink font-medium">Zero-Latency <br />Reinforcement.</h2>
              <p className="text-lg text-ink/60 mb-12 font-body font-light leading-relaxed">
                By optimizing the prefill stage, we reinforce instructions without increasing the generation time. Your users get more accurate results without the wait.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="text-2xl font-display mb-2 text-ink">1.2ms</h5>
                  <p className="text-sm text-ink/40">Average Overhead</p>
                </div>
                <div>
                  <h5 className="text-2xl font-display mb-2 text-ink">0%</h5>
                  <p className="text-sm text-ink/40">Output Latency Increase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Edge Network Section */}
      <section className="reveal-section py-32 px-6 bg-black/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">Infrastructure</span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl mb-8 leading-tight text-ink font-medium">Global Edge <br />Optimization.</h2>
          <p className="text-lg text-ink/60 max-w-2xl mx-auto mb-20 font-body font-light leading-relaxed">
            Our optimization layer runs on a globally distributed edge network, ensuring sub-millisecond processing regardless of your user&apos;s location.
          </p>
          
          <div className="relative aspect-[21/9] w-full bg-white rounded-[48px] border border-black/5 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 retro-stripes opacity-5"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full p-20">
                {/* Simulated Map Dots */}
                {[
                  { t: '10%', l: '20%', c: 'bg-primary' },
                  { t: '30%', l: '45%', c: 'bg-accent' },
                  { t: '20%', l: '70%', c: 'bg-retro-red' },
                  { t: '60%', l: '15%', c: 'bg-retro-yellow' },
                  { t: '75%', l: '50%', c: 'bg-primary' },
                  { t: '55%', l: '85%', c: 'bg-accent' },
                ].map((dot, i) => (
                  <motion.div
                    key={i}
                    style={{ top: dot.t, left: dot.l }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className={`absolute w-4 h-4 rounded-full ${dot.c} blur-sm`}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[200px] opacity-[0.03] pointer-events-none select-none">🌍</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="reveal-section py-32 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl font-display font-medium text-center mb-20 text-ink">Common Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Repetition impact on token costs.", a: "Repetition increases input tokens. However, our Adaptive mode prunes redundant segments to minimize cost while maximizing accuracy uplift." },
              { q: "Repetition impact on response speed.", a: "Repetition affects only the prefill stage. Since modern LLMs process prefill tokens in parallel, the impact on Time-To-First-Token (TTFT) is negligible." },
              { q: "Supported models.", a: "PromptRepeat is model-agnostic. It works with OpenAI, Anthropic, Gemini, Mistral, and any other causal LLM provider." },
              { q: "Data security protocols.", a: "We never store your prompts. Our middleware acts as a pass-through layer with end-to-end encryption." }
            ].map((faq, i) => (
              <div key={i} className="p-10 mistral-card hover:border-primary/20 transition-all group">
                <h4 className="text-xl font-medium mb-4 text-ink group-hover:text-primary transition-colors">{faq.q}</h4>
                <p className="text-base text-ink/50 leading-relaxed font-body font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
