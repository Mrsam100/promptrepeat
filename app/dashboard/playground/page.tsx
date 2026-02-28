'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  BrainCircuit,
  ListFilter,
  Anchor
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { RepetitionMode, ExecutionResult } from '@/lib/types';

export default function Playground() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<RepetitionMode>('x2');
  const [manualSegments, setManualSegments] = useState('');
  const [model, setModel] = useState('gemini-3-flash-preview');
  const [enableAlignment, setEnableAlignment] = useState(true);
  const [enableIntentExpansion, setEnableIntentExpansion] = useState(false);
  const [enableEntropyMonitoring, setEnableEntropyMonitoring] = useState(false);
  const [enableLatentAnchoring, setEnableLatentAnchoring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const segments = manualSegments.split('\n').filter(s => s.trim() !== '');
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          model,
          enableAlignment,
          enableIntentExpansion,
          enableEntropyMonitoring,
          enableLatentAnchoring,
          segments: mode === 'selective' ? segments : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Optimization failed');
        return;
      }

      setResult(data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const MAX_PROMPT_LENGTH = 50000;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 min-h-[calc(100vh-12rem)] relative z-10">
      {/* Input Section */}
      <div className="lg:col-span-1 flex flex-col gap-8">
        <div className="p-10 mistral-card shadow-sm flex flex-col flex-grow relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-medium text-ink">Input Prompt</h3>
              <button
                onClick={() => setPrompt('')}
                className="text-[10px] font-bold uppercase tracking-widest text-ink/20 hover:text-ink transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={MAX_PROMPT_LENGTH}
              placeholder="Enter your prompt here... Use [[text]] for selective repetition."
              className="flex-grow w-full p-6 rounded-2xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none font-body text-base text-ink/80 placeholder:text-ink/20"
            />
            {prompt.length > 0 && (
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 text-right ${prompt.length > MAX_PROMPT_LENGTH * 0.9 ? 'text-retro-red' : 'text-ink/20'}`}>
                {prompt.length.toLocaleString()} / {MAX_PROMPT_LENGTH.toLocaleString()}
              </p>
            )}

            <div className="mt-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/40 block">Repetition Mode</label>
                  {mode === 'selective' && (
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">Use [[ ]] markers</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['x2', 'x3', 'adaptive', 'selective', 'neural-reasoning'] as RepetitionMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                        mode === m
                          ? 'bg-primary/10 border-primary text-primary shadow-sm'
                          : 'bg-black/5 border-black/5 text-ink/40 hover:border-black/20 hover:text-ink'
                      } ${m === 'neural-reasoning' ? 'col-span-2' : ''}`}
                    >
                      {m === 'neural-reasoning' ? 'Neural Reasoning' : m}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {mode === 'selective' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/40 mb-4 block flex items-center gap-3">
                      <ListFilter size={14} />
                      Manual Segments
                    </label>
                    <textarea
                      value={manualSegments}
                      onChange={(e) => setManualSegments(e.target.value)}
                      placeholder="Enter segments to repeat (one per line)..."
                      className="w-full h-32 p-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none font-body text-xs text-ink/70 placeholder:text-ink/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5 pt-6 border-t border-black/5">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/40 block">Enhancement Layers</label>
                {[
                  { id: 'latent-anchoring', icon: Anchor, label: 'Latent Anchoring', desc: 'Prevent semantic drift', color: 'text-indigo-400' },
                  { id: 'alignment', icon: ShieldCheck, label: 'Alignment Guardrails', desc: 'Safety & truthfulness', color: 'text-accent' },
                  { id: 'intent-expansion', icon: Sparkles, label: 'Intent Expansion', desc: 'Unpack latent goals', color: 'text-retro-yellow' },
                  { id: 'entropy', icon: RefreshCw, label: 'Entropy Monitoring', desc: 'Uncertainty tracking', color: 'text-retro-red' }
                ].map((feature) => {
                  const isOn =
                    (feature.id === 'latent-anchoring' && enableLatentAnchoring) ||
                    (feature.id === 'alignment' && enableAlignment) ||
                    (feature.id === 'intent-expansion' && enableIntentExpansion) ||
                    (feature.id === 'entropy' && enableEntropyMonitoring);
                  return (
                    <div key={feature.id} className="flex items-center justify-between group/feat relative">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-black/5 border border-black/5 ${feature.color}`}>
                          <feature.icon size={16} />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-ink/80 uppercase tracking-widest">{feature.label}</label>
                          <p className="text-[10px] text-ink/30 font-body font-light">{feature.desc}</p>
                        </div>
                      </div>
                      <button
                        role="switch"
                        aria-checked={isOn}
                        aria-label={`Toggle ${feature.label}`}
                        onClick={() => {
                          if (feature.id === 'latent-anchoring') setEnableLatentAnchoring(!enableLatentAnchoring);
                          if (feature.id === 'alignment') setEnableAlignment(!enableAlignment);
                          if (feature.id === 'intent-expansion') setEnableIntentExpansion(!enableIntentExpansion);
                          if (feature.id === 'entropy') setEnableEntropyMonitoring(!enableEntropyMonitoring);
                        }}
                        className={`w-12 h-7 rounded-full transition-all relative ${isOn ? 'bg-primary shadow-sm' : 'bg-black/10'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${isOn ? 'left-6 shadow-sm' : 'left-1'}`}></div>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-black/5">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink/20 mb-4 block">Engine Model</label>
                <div className="relative">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest border border-black/5 bg-black/5 text-ink appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  >
                    <option value="gemini-3-flash-preview" className="bg-surface">Gemini 3 Flash</option>
                    <option value="gemini-3.1-pro-preview" className="bg-surface">Gemini 3.1 Pro</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40" />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-retro-red/10 border border-retro-red/20 text-retro-red text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleOptimize}
                disabled={isLoading || !prompt.trim()}
                className="w-full py-5 rounded-xl bg-ink text-surface font-bold uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
                {isLoading ? 'Processing...' : 'Optimize & Run'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        <div className="flex flex-col h-full gap-8">
          {/* Comparison View */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-grow min-h-0">
            {/* Original Prompt */}
            <div className="p-8 mistral-card shadow-sm flex flex-col relative overflow-hidden bg-black/[0.02]">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-medium text-ink/60">Original</h3>
                  <div className="px-3 py-1 rounded-lg bg-black/5 text-[10px] font-bold uppercase tracking-widest text-ink/40 border border-black/5">
                    Source
                  </div>
                </div>
                <div className="flex-grow p-5 rounded-xl bg-white/50 border border-black/5 overflow-auto font-body text-sm text-ink/40 whitespace-pre-wrap leading-relaxed">
                  {prompt || 'No input provided'}
                </div>
              </div>
            </div>

            {/* Optimized Prompt */}
            <div className="p-8 mistral-card shadow-sm flex flex-col relative overflow-hidden bg-primary/[0.02]">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-medium text-primary">Optimized</h3>
                  {result && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold uppercase tracking-widest border border-primary/20">x{result.repetitionCount}</span>
                      <button
                        onClick={() => copyToClipboard(result.optimizedPrompt)}
                        className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-ink/40"
                      >
                        {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-grow p-5 rounded-xl bg-white/50 border border-primary/10 overflow-auto font-mono text-[11px] text-ink/60 whitespace-pre-wrap leading-relaxed">
                  {result ? result.optimizedPrompt : 'Optimized prompt will appear here...'}
                </div>
              </div>
            </div>

            {/* Model Output */}
            <div className="p-8 mistral-card shadow-sm flex flex-col relative overflow-hidden bg-accent/[0.02]">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-medium text-accent">Output</h3>
                  {result && (
                    <span className={`text-[10px] px-3 py-1 rounded-lg font-bold uppercase tracking-widest border ${result.alignmentStatus === 'passed' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-retro-red/10 text-retro-red border-retro-red/20'}`}>
                      {result.alignmentStatus}
                    </span>
                  )}
                </div>
                <div className="flex-grow p-6 rounded-xl bg-white/50 border border-accent/10 overflow-auto font-body text-sm text-ink/80 prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/5 prose-pre:text-ink prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:rounded">
                  {result ? (
                    <ReactMarkdown>{result.output}</ReactMarkdown>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-ink/10 gap-4">
                      <Zap size={48} strokeWidth={1} className="animate-pulse" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Awaiting execution</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Bar */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="p-6 mistral-card border border-black/5 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Latency</span>
                <div className="flex items-center gap-2 text-xl font-display font-medium text-ink">
                  <Clock size={18} className="text-primary" />
                  {result.latencyMs}ms
                </div>
              </div>
              <div className="p-6 mistral-card border border-black/5 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Confidence</span>
                <div className="flex items-center gap-2 text-xl font-display font-medium text-ink">
                  <ShieldCheck size={18} className="text-accent" />
                  {((result.confidenceScore ?? 0) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-6 mistral-card border border-black/5 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Task Type</span>
                <div className="flex items-center gap-2 text-xl font-display font-medium text-ink capitalize">
                  <BrainCircuit size={18} className="text-retro-yellow" />
                  {result.taskType || 'General'}
                </div>
              </div>
              <div className="p-6 mistral-card border border-black/5 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Entropy</span>
                <div className="flex items-center gap-2 text-xl font-display font-medium text-ink capitalize">
                  <RefreshCw size={18} className={result.entropyLevel === 'low' ? 'text-accent' : result.entropyLevel === 'medium' ? 'text-retro-yellow' : 'text-retro-red'} />
                  {result.entropyLevel || 'Low'}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
