'use client';

import { motion } from 'motion/react';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For hobbyists and experimenters.',
    features: ['1,000 optimizations/mo', 'x2 Repetition mode', 'Standard latency', 'Community support'],
    cta: 'Start for Free',
    href: '/login',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For professional developers and startups.',
    features: ['50,000 optimizations/mo', 'All repetition modes', 'Priority latency', 'Email support', 'API Access'],
    cta: 'Go Pro',
    href: '/login',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large scale production systems.',
    features: ['Unlimited optimizations', 'Adaptive engine v2', 'Ultra-low latency', 'Dedicated support', 'SLA guarantees'],
    cta: 'Contact Sales',
    href: '/contact',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl mb-6 text-ink font-medium">Transparent pricing.</h2>
          <p className="text-ink/40 max-w-2xl mx-auto">Choose the plan that fits your scale. No hidden fees.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className={`p-10 mistral-card border ${plan.highlight ? 'border-primary shadow-xl shadow-primary/10' : 'border-black/5'} flex flex-col group relative overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-shadow duration-500`}
            >
              {/* Gradient bg on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Popular badge */}
              {plan.highlight && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  viewport={{ once: true }}
                  className="absolute -top-px -right-px px-4 py-1.5 bg-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-xl rounded-tr-xl flex items-center gap-1"
                >
                  <Star size={10} fill="currentColor" /> Popular
                </motion.div>
              )}

              <h3 className="text-2xl mb-2 text-ink font-medium relative z-10">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4 relative z-10">
                <span className="text-5xl font-display font-medium text-ink">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-ink/40 text-sm font-bold uppercase tracking-widest">/mo</span>}
              </div>
              <p className="text-sm text-ink/60 mb-10 relative z-10">{plan.description}</p>

              <div className="space-y-5 mb-10 flex-grow relative z-10">
                {plan.features.map((feature, fi) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + fi * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 text-sm text-ink/80"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <Check size={14} />
                    </div>
                    {feature}
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative z-10">
                <Link
                  href={plan.href}
                  className={`block w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center ${plan.highlight ? 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-lg hover:shadow-primary/20' : 'bg-black/5 text-ink hover:bg-black/10 border border-black/5'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
