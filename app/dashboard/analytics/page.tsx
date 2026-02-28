'use client';

import { motion } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Zap,
  Clock,
  Download,
  AlertCircle
} from 'lucide-react';

const MODE_COLORS: Record<string, string> = {
  x2: 'var(--color-primary)',
  x3: 'var(--color-accent)',
  adaptive: 'var(--color-retro-red)',
  selective: 'var(--color-retro-yellow)',
  'neural-reasoning': '#1a1a1a',
};

interface AnalyticsData {
  timeSeriesData: { date: string; optimizations: number; avgLatency: number; avgPromptLength: number }[];
  modeDistribution: { name: string; value: number }[];
  stats: {
    total: number;
    avgLatency: number;
    minLatency: number;
    maxLatency: number;
    avgPromptLength: number;
  };
}

export default function Analytics() {
  const [range, setRange] = useState(7);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (r: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/dashboard/analytics?range=${r}`);
      if (!res.ok) throw new Error('Failed to load analytics data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const handleExport = () => {
    if (!data) return;
    const headers = 'Date,Optimizations,Avg Latency (ms),Avg Prompt Length\n';
    const rows = data.timeSeriesData
      .map((r) => `${r.date},${r.optimizations},${r.avgLatency},${r.avgPromptLength}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptrepeat-analytics-${range}d.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const pieData = data?.modeDistribution.map((m) => ({
    ...m,
    color: MODE_COLORS[m.name] || 'var(--color-ink)',
  })) || [];

  const totalPieValue = pieData.reduce((sum, p) => sum + p.value, 0);

  if (loading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-center">
          <div className="h-10 bg-black/5 rounded-2xl w-72 animate-pulse" />
          <div className="h-10 bg-black/5 rounded-2xl w-36 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-10 mistral-card animate-pulse"><div className="h-80 bg-black/5 rounded" /></div>
          <div className="p-10 mistral-card animate-pulse"><div className="h-64 bg-black/5 rounded" /></div>
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
          onClick={() => fetchData(range)}
          className="inline-flex items-center gap-2 bg-ink text-surface px-6 py-3 rounded-xl font-bold hover:bg-primary transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (!data || data.stats.total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Zap size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-display font-medium text-ink mb-3">No analytics data yet</h2>
        <p className="text-ink/50 max-w-md">Use the Playground to optimize some prompts and your analytics will appear here.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div className="flex items-center gap-2 bg-black/5 p-1 rounded-2xl border border-black/5">
          {[7, 30, 90].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                range === r ? 'bg-primary/10 text-primary' : 'text-ink/40 hover:bg-black/5'
              }`}
            >
              Last {r} Days
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-ink text-surface text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'Total', value: data.stats.total.toLocaleString(), icon: Zap },
          { label: 'Avg Latency', value: `${data.stats.avgLatency}ms`, icon: Clock },
          { label: 'Min Latency', value: `${data.stats.minLatency}ms`, icon: TrendingUp },
          { label: 'Avg Prompt Length', value: `${data.stats.avgPromptLength} chars`, icon: TrendingUp },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 mistral-card shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1">{s.label}</p>
            <p className="text-2xl font-display font-medium text-ink">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-display font-medium text-ink mb-2">Optimization Volume</h3>
              <p className="text-sm text-ink/40 font-body font-light">Daily prompt optimizations</p>
            </div>
          </div>
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeSeriesData}>
                <defs>
                  <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Area type="monotone" dataKey="optimizations" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorOpt)" strokeWidth={2} name="Optimizations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mode Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden"
        >
          <h3 className="text-2xl font-display font-medium text-ink mb-10 relative z-10">Mode Distribution</h3>
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-5 mt-10 relative z-10">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-ink/40">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-ink">
                  {totalPieValue > 0 ? Math.round((item.value / totalPieValue) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Latency Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-2xl font-display font-medium text-ink">Latency Trends</h3>
            <div className="p-3 rounded-xl bg-black/5 text-ink/40 border border-black/5">
              <Clock size={20} />
            </div>
          </div>
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Line type="monotone" dataKey="avgLatency" stroke="var(--color-retro-red)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-retro-red)', strokeWidth: 2, stroke: '#fff' }} name="Avg Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Prompt Length */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-2xl font-display font-medium text-ink">Prompt Length</h3>
            <div className="p-3 rounded-xl bg-accent/10 text-accent border border-accent/20">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Bar dataKey="avgPromptLength" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} name="Avg Prompt Length (chars)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
