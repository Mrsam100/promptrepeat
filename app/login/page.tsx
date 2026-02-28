'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Github, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Signup failed');
          setIsLoading(false);
          return;
        }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(isSignUp ? 'Account created but login failed. Try signing in.' : 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      window.location.href = '/dashboard';
    } catch {
      setError('Something went wrong');
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-retro-yellow/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Retro stripes decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full retro-stripes opacity-10 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(26,26,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md mistral-card border border-black/5 shadow-2xl shadow-black/5 p-10 relative z-10 overflow-hidden group"
      >
        {/* Card shimmer on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <div className="relative">
              <Logo className="w-16 h-16" />
              <motion.div
                className="absolute -top-1 -right-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                <Sparkles size={16} className="text-primary" />
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-display font-medium text-ink mb-3">
                {isSignUp ? 'Create account' : 'Welcome back'}
              </h1>
              <p className="text-sm text-ink/40 font-body font-light">
                {isSignUp ? 'Sign up to start optimizing your prompts.' : 'Enter your credentials to access your dashboard.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-6 relative z-10">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="p-4 rounded-xl bg-retro-red/10 border border-retro-red/20 text-retro-red text-xs font-bold uppercase tracking-widest text-center overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Full Name</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within/input:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink placeholder:text-ink/20"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Email Address</label>
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within/input:text-primary transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/20 focus:bg-white transition-all font-body text-sm text-ink placeholder:text-ink/20"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Password</label>
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
            {!isSignUp && (
              <Link href="/reset-password" className="text-xs text-primary/70 hover:text-primary font-medium transition-colors">
                Forgot password?
              </Link>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 40px -10px rgba(255,90,31,0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 rounded-xl bg-ink text-surface font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center gap-3 group/btn disabled:opacity-50"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full"
              />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-ink/20">Or continue with</span>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleGitHubSignIn}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl border border-black/5 bg-white/50 transition-all flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-ink/80"
          >
            <Github size={18} />
            GitHub
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 text-center text-sm text-ink/40 font-body font-light"
        >
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-primary font-bold hover:text-ink transition-colors"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
