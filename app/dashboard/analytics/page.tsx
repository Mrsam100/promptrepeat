'use client';

import { motion } from 'motion/react';
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
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar
} from 'lucide-react';

const data = [
  { name: 'Jan', optimizations: 4000, accuracy: 82, latency: 150 },
  { name: 'Feb', optimizations: 3000, accuracy: 85, latency: 145 },
  { name: 'Mar', optimizations: 2000, accuracy: 88, latency: 140 },
  { name: 'Apr', optimizations: 2780, accuracy: 84, latency: 155 },
  { name: 'May', optimizations: 1890, accuracy: 91, latency: 135 },
  { name: 'Jun', optimizations: 2390, accuracy: 89, latency: 138 },
  { name: 'Jul', optimizations: 3490, accuracy: 94, latency: 130 },
];

const pieData = [
  { name: 'x2 Mode', value: 45, color: 'var(--color-primary)' },
  { name: 'x3 Mode', value: 25, color: 'var(--color-accent)' },
  { name: 'Adaptive', value: 20, color: 'var(--color-retro-red)' },
  { name: 'Selective', value: 10, color: 'var(--color-retro-yellow)' },
];

export default function Analytics() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div className="flex items-center gap-2 bg-black/5 p-1 rounded-2xl border border-black/5">
          <button className="px-5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">Last 7 Days</button>
          <button className="px-5 py-2.5 rounded-xl text-ink/40 text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-all">Last 30 Days</button>
          <button className="px-5 py-2.5 rounded-xl text-ink/40 text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-all">Last 90 Days</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-black/5 bg-white/50 text-ink/60 text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-all">
            <Filter size={14} />
            Filter
          </button>
          <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-ink text-surface text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
            <Download size={14} />
            Export Data
          </button>
        </div>
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
              <h3 className="text-2xl font-display font-medium text-ink mb-2">Performance Overview</h3>
              <p className="text-sm text-ink/40 font-body font-light">Optimization volume vs. Accuracy uplift</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary shadow-sm"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent shadow-sm"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Accuracy</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Area type="monotone" dataKey="optimizations" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorOpt)" strokeWidth={2} />
                <Area type="monotone" dataKey="accuracy" stroke="var(--color-accent)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
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
                <span className="text-sm font-bold text-ink">{item.value}%</span>
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
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Line type="stepAfter" dataKey="latency" stroke="var(--color-retro-red)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-retro-red)', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Token Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-10 mistral-card border border-black/5 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-2xl font-display font-medium text-ink">Token Efficiency</h3>
            <div className="p-3 rounded-xl bg-accent/10 text-accent border border-accent/20">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Bar dataKey="accuracy" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
