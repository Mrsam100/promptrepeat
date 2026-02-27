'use client';

import { motion } from 'motion/react';
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Terminal
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

const data = [
  { name: 'Mon', usage: 2400, accuracy: 85 },
  { name: 'Tue', usage: 1398, accuracy: 88 },
  { name: 'Wed', usage: 9800, accuracy: 82 },
  { name: 'Thu', usage: 3908, accuracy: 91 },
  { name: 'Fri', usage: 4800, accuracy: 89 },
  { name: 'Sat', usage: 3800, accuracy: 94 },
  { name: 'Sun', usage: 4300, accuracy: 92 },
];

const stats = [
  { label: 'Total Optimizations', value: '124,592', icon: Zap, trend: '+12.5%', isUp: true },
  { label: 'Avg. Accuracy Uplift', value: '24.8%', icon: TrendingUp, trend: '+4.2%', isUp: true },
  { label: 'Avg. Latency', value: '142ms', icon: Clock, trend: '-8ms', isUp: true },
  { label: 'Active Projects', value: '12', icon: Activity, trend: '0', isUp: false },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-accent' : 'text-ink/40'}`}>
                  {stat.trend}
                  {stat.isUp ? <ArrowUpRight size={12} /> : null}
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
          <h3 className="text-xl font-display font-medium text-ink mb-8 relative z-10">Usage Trends</h3>
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="usage" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 mistral-card shadow-sm relative overflow-hidden"
        >
          <h3 className="text-xl font-display font-medium text-ink mb-8 relative z-10">Accuracy Uplift</h3>
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1a1a1a' }}
                />
                <Bar dataKey="accuracy" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
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
        <h3 className="text-xl font-display font-medium text-ink mb-8 relative z-10">Recent Optimizations</h3>
        <div className="space-y-4 relative z-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-xl hover:bg-black/5 transition-all border border-transparent hover:border-black/5 group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-black/5 text-primary flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                  <Terminal size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">Customer Support Classification</p>
                  <p className="text-xs text-ink/40 font-medium">Mode: Adaptive • 2 mins ago</p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-sm font-bold text-accent">+22%</p>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Accuracy</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">142ms</p>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Latency</p>
                </div>
                <button className="text-primary text-xs font-bold uppercase tracking-widest hover:text-ink transition-colors">View</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
