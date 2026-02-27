'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-retro-red/10 flex items-center justify-center text-retro-red mb-6">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-2xl font-display font-medium text-ink mb-3">Something went wrong</h2>
      <p className="text-sm text-ink/50 font-body font-light mb-8 max-w-md">
        An unexpected error occurred in the dashboard. Please try again or contact support if the problem persists.
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 rounded-xl bg-ink text-surface text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
