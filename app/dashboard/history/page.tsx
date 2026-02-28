'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronDown, ChevronLeft, ChevronRight, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  promptText: string | null;
  optimizedText: string | null;
  outputText: string | null;
  repetitionMode: string;
  latencyMs: number;
  taskType: string | null;
  confidenceScore: number | null;
  promptLength: number;
  timestamp: string;
}

interface HistoryData {
  items: HistoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export default function History() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginating, setPaginating] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async (p: number, isPageChange = false) => {
    if (isPageChange) {
      setPaginating(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const res = await fetch(`/api/dashboard/history?page=${p}`);
      if (!res.ok) throw new Error('Failed to load history');
      const json = await res.json();
      setData(json);
      setExpandedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setPaginating(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(page, page > 1);
  }, [page, fetchHistory]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for non-HTTPS or restricted contexts
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 bg-black/5 rounded w-48 animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-6 mistral-card animate-pulse">
            <div className="h-4 bg-black/5 rounded w-3/4 mb-3" />
            <div className="h-3 bg-black/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error && !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-retro-red/10 flex items-center justify-center mb-6">
          <AlertCircle size={32} className="text-retro-red" />
        </div>
        <h2 className="text-2xl font-display font-medium text-ink mb-3">Something went wrong</h2>
        <p className="text-ink/50 mb-8 max-w-md">{error}</p>
        <button
          onClick={() => fetchHistory(1)}
          className="inline-flex items-center gap-2 bg-ink text-surface px-6 py-3 rounded-xl font-bold hover:bg-primary transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Clock size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-display font-medium text-ink mb-3">No history yet</h2>
        <p className="text-ink/50 mb-8 max-w-md">Your prompt optimization history will appear here after you use the Playground.</p>
        <Link
          href="/dashboard/playground"
          className="inline-flex items-center gap-2 bg-ink text-surface px-6 py-3 rounded-xl font-bold hover:bg-primary transition-colors"
        >
          Go to Playground
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-medium text-ink">
          Prompt History <span className="text-ink/30 text-lg ml-2">({data.total})</span>
        </h2>
        {paginating && <Loader2 size={20} className="animate-spin text-primary" />}
      </div>

      <div className={`space-y-4 transition-opacity ${paginating ? 'opacity-50' : ''}`}>
        {data.items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="mistral-card shadow-sm overflow-hidden"
          >
            {/* Summary Row */}
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-black/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0 mr-6">
                <p className="text-sm font-bold text-ink truncate">
                  {item.promptText || `Prompt (${item.promptLength} chars)`}
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {item.repetitionMode}
                  </span>
                  {item.taskType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-black/5 text-ink/50 text-[10px] font-bold uppercase tracking-wider">
                      {item.taskType}
                    </span>
                  )}
                  <span className="text-xs text-ink/40">{item.latencyMs}ms</span>
                  {item.confidenceScore != null && (
                    <span className="text-xs text-ink/40">{Math.round(item.confidenceScore * 100)}% confidence</span>
                  )}
                  <span className="text-xs text-ink/30">{timeAgo(item.timestamp)}</span>
                </div>
              </div>
              <ChevronDown
                size={16}
                className={`text-ink/30 shrink-0 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4 border-t border-black/5 pt-4">
                    {/* Original Prompt */}
                    {item.promptText && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Original Prompt</p>
                          <button
                            onClick={() => copyToClipboard(item.promptText!, `prompt-${item.id}`)}
                            className="p-2 rounded-lg text-ink/30 hover:text-primary hover:bg-black/5 transition-colors"
                          >
                            {copiedId === `prompt-${item.id}` ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <div className="p-4 rounded-xl bg-black/5 text-sm text-ink/70 max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
                          {item.promptText}
                        </div>
                      </div>
                    )}

                    {/* Optimized Prompt */}
                    {item.optimizedText && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Optimized Prompt</p>
                          <button
                            onClick={() => copyToClipboard(item.optimizedText!, `opt-${item.id}`)}
                            className="p-2 rounded-lg text-ink/30 hover:text-primary hover:bg-black/5 transition-colors"
                          >
                            {copiedId === `opt-${item.id}` ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm text-ink/80 max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
                          {item.optimizedText}
                        </div>
                      </div>
                    )}

                    {/* Model Output */}
                    {item.outputText && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Model Output</p>
                          <button
                            onClick={() => copyToClipboard(item.outputText!, `out-${item.id}`)}
                            className="p-2 rounded-lg text-ink/30 hover:text-primary hover:bg-black/5 transition-colors"
                          >
                            {copiedId === `out-${item.id}` ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 text-sm text-ink/80 max-h-60 overflow-y-auto whitespace-pre-wrap break-words">
                          {item.outputText}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || paginating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 text-sm font-bold text-ink/60 hover:bg-black/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-sm text-ink/40 font-medium">
            Page {data.page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages || paginating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 text-sm font-bold text-ink/60 hover:bg-black/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
