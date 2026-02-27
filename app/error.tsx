'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-2xl bg-retro-red/10 flex items-center justify-center text-retro-red mb-6 mx-auto"
        >
          <motion.div animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ duration: 0.5, delay: 0.5 }}>
            <AlertTriangle size={32} />
          </motion.div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-display font-medium text-ink mb-3"
        >
          Something went wrong
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-ink/50 font-body font-light mb-8"
        >
          An unexpected error occurred. Please try again or return to the homepage.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-ink text-surface text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
          >
            Try Again
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl border border-black/10 text-xs font-bold uppercase tracking-widest text-ink/60 hover:bg-black/5 transition-all"
            >
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
