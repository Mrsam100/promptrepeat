'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // If no token/email in URL, show the "request reset" form
  const [requestEmail, setRequestEmail] = useState('');
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestEmail.trim()) return;

    setRequestStatus('loading');
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: requestEmail }),
      });
      // Always show success to prevent email enumeration
      setRequestStatus('sent');
    } catch {
      setRequestStatus('sent');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset password');
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  // No token = show "request reset" form
  if (!token || !email) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md mistral-card border border-black/5 shadow-2xl shadow-black/5 p-10 relative z-10"
        >
          <div className="text-center mb-10">
            <Link href="/" className="flex justify-center mb-6">
              <Logo className="w-16 h-16" />
            </Link>

            <AnimatePresence mode="wait">
              {requestStatus === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <CheckCircle2 size={48} className="mx-auto text-primary" />
                  <h1 className="text-3xl font-display font-medium text-ink">Check your email</h1>
                  <p className="text-sm text-ink/40 font-body font-light">
                    If an account exists with that email, we&apos;ve sent a password reset link.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:text-ink transition-colors mt-4"
                  >
                    Back to Sign In <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h1 className="text-3xl font-display font-medium text-ink mb-3">Forgot Password?</h1>
                  <p className="text-sm text-ink/40 font-body font-light">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {requestStatus !== 'sent' && (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Email Address</label>
                <input
                  type="email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full px-5 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink placeholder:text-ink/20"
                />
              </div>

              <button
                type="submit"
                disabled={requestStatus === 'loading'}
                className="w-full py-5 rounded-xl bg-ink text-surface font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {requestStatus === 'loading' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full"
                  />
                ) : (
                  <>Send Reset Link</>
                )}
              </button>

              <p className="text-center text-sm text-ink/40 font-body font-light">
                Remember your password?{' '}
                <Link href="/login" className="text-primary font-bold hover:text-ink transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  // Has token = show "set new password" form
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md mistral-card border border-black/5 shadow-2xl shadow-black/5 p-10 relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="flex justify-center mb-6">
            <Logo className="w-16 h-16" />
          </Link>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <CheckCircle2 size={48} className="mx-auto text-primary" />
                <h1 className="text-3xl font-display font-medium text-ink">Password Reset!</h1>
                <p className="text-sm text-ink/40 font-body font-light">
                  Your password has been updated. You can now sign in with your new password.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:text-ink transition-colors mt-4"
                >
                  Sign In <ArrowRight size={14} />
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-3xl font-display font-medium text-ink mb-3">Set New Password</h1>
                <p className="text-sm text-ink/40 font-body font-light">
                  Enter your new password below.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {status !== 'success' && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-retro-red/10 border border-retro-red/20 text-retro-red text-xs font-bold uppercase tracking-widest text-center overflow-hidden flex items-center justify-center gap-2"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">New Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within/input:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink placeholder:text-ink/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Confirm Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within/input:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink placeholder:text-ink/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-5 rounded-xl bg-ink text-surface font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full"
                />
              ) : (
                <>Reset Password</>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
