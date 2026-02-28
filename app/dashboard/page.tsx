'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  BarChart3,
  Layers,
  Terminal,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';

interface StatsData {
  totalOptimizations: number;
  avgLatencyMs: number;
  thisWeekCount: number;
  mostUsedMode: string;
  chartData: { name: string; date: string; usage: number; avgLatency: number }[];
  recent: {
    id: string;
    promptText: string | null;
    repetitionMode: string;
    latencyMs: number;
    taskType: string | null;
    timestamp: string;
    promptLength: number;
  }[];
}

export default function Dashboard() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dashboard data');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Something went wrong'))
      .finally(() => setLoading(false));
  }, []);

  const stats = data
    ? [
        { label: 'Total Optimizations', value: data.totalOptimizations.toLocaleString(), icon: Zap },
        { label: 'Avg. Latency', value: `${data.avgLatencyMs}ms`, icon: Clock },
        { label: 'This Week', value: data.thisWeekCount.toLocaleString(), icon: BarChart3 },
        { label: 'Top Mode', value: data.mostUsedMode, icon: Layers },
      ]
    : [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 mistral-card shadow-sm animate-pulse">
              <div className="h-4 bg-black/5 rounded w-1/2 mb-4" />
              <div className="h-8 bg-black/5 rounded w-2/3" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="p-8 mistral-card shadow-sm animate-pulse">
              <div className="h-4 bg-black/5 rounded w-1/3 mb-8" />
              <div className="h-80 bg-black/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-ink text-surface px-6 py-3 rounded-xl font-bold hover:bg-primary transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (!data || data.totalOptimizations === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Zap size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-display font-medium text-ink mb-3">No optimizations yet</h2>
        <p className="text-ink/50 mb-8 max-w-md">Head to the Playground to run your first prompt optimization and see your stats here.</p>
        <Link
          href="/dashboard/playground"
          className="inline-flex items-center gap-2 bg-ink text-surface px-6 py-3 rounded-xl font-bold hover:bg-primary transition-colors"
        >
          Go to Playground <ArrowRight size={16} />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 mistral-card shadow-sm relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-black/5 text-primary border border-black/5">
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-display font-medium text-ink">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 mistral-card shadow-sm relative overflow-hidden"
        >
          <h3 className="text-xl font-display font-medium text-ink mb-8 relative z-10">Usage This Week</h3>
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Area type="monotone" dataKey="usage" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2} name="Optimizations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 mistral-card shadow-sm relative overflow-hidden"
        >
          <h3 className="text-xl font-display font-medium text-ink mb-8 relative z-10">Avg. Latency (ms)</h3>
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Bar dataKey="avgLatency" fill="var(--color-accent)" radius={[4, 4, 0, 0]} name="Avg Latency (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 mistral-card shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-xl font-display font-medium text-ink">Recent Optimizations</h3>
          <Link href="/dashboard/history" className="text-primary text-xs font-bold uppercase tracking-widest hover:text-ink transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-4 relative z-10">
          {data.recent.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 rounded-xl hover:bg-black/5 transition-all border border-transparent hover:border-black/5 group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-black/5 text-primary flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                  <Terminal size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">
                    {item.promptText ? (item.promptText.length > 60 ? item.promptText.substring(0, 60) + '...' : item.promptText) : `Prompt (${item.promptLength} chars)`}
                  </p>
                  <p className="text-xs text-ink/40 font-medium">
                    Mode: {item.repetitionMode}{item.taskType ? ` \u2022 ${item.taskType}` : ''} \u2022 {timeAgo(item.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">{item.latencyMs}ms</p>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Latency</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
