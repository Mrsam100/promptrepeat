'use client';

import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Terminal,
  BarChart3,
  Settings,
  Clock,
  LogOut,
  Home as HomeIcon,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Logo from '@/components/Logo';

const menuItems = [
  { icon: HomeIcon, label: 'Home', href: '/' },
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Terminal, label: 'Playground', href: '/dashboard/playground' },
  { icon: Clock, label: 'History', href: '/dashboard/history' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'User';
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-surface flex relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-black/5 bg-white/50 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
              <Logo className="w-10 h-10" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-medium tracking-tight text-ink group-hover:text-primary transition-colors">PromptRepeat</span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-ink/40 font-bold">Dashboard</span>
            </div>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar" className="lg:hidden text-ink/40 hover:text-ink transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-1 mt-4">
          {menuItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 relative group ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-ink/40 hover:bg-black/5 hover:text-ink hover:pl-7'
                  }`}
                >
                  <item.icon size={16} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-6 border-t border-black/5">
          <motion.button
            onClick={() => signOut({ callbackUrl: '/' })}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-ink/40 hover:bg-retro-red/10 hover:text-retro-red transition-all w-full"
          >
            <LogOut size={16} />
            Sign Out
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 p-6 md:p-10 relative z-10 w-full">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <motion.button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-lg bg-black/5 text-ink hover:bg-black/10 transition-colors"
            >
              <Menu size={20} />
            </motion.button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-medium text-ink mb-1 md:mb-2">Welcome back, {userName}</h1>
              <p className="text-xs md:text-sm text-ink/40 font-body font-light">Here&apos;s your usage overview.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
             <div className="flex items-center gap-3">
               <motion.div
                 whileHover={{ scale: 1.1 }}
                 className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-surface bg-primary/10 flex items-center justify-center shadow-sm text-primary text-xs font-bold"
               >
                 {session?.user?.image ? (
                   <img src={session.user.image} alt={`${userName}'s avatar`} className="w-full h-full rounded-full object-cover" />
                 ) : (
                   userInitials
                 )}
               </motion.div>
               <span className="text-xs font-bold text-ink/40 uppercase tracking-widest hidden md:block">
                 {session?.user?.email}
               </span>
             </div>
             <motion.button
               onClick={() => router.push('/dashboard/playground')}
               whileHover={{ scale: 1.05, boxShadow: '0 10px 30px -10px rgba(255,90,31,0.3)' }}
               whileTap={{ scale: 0.95 }}
               className="bg-ink text-surface px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
             >
                New Prompt
             </motion.button>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
