'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="pt-48 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-display font-medium text-ink mb-12">Terms of Service</h1>
            <div className="prose prose-ink max-w-none font-body font-light text-ink/60 leading-relaxed space-y-8">
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">1. Acceptance of Terms</h2>
                <p>By accessing or using PromptRepeat, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              </section>
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">2. Use License</h2>
                <p>We grant you a limited, non-exclusive, non-transferable license to use our platform for your internal business operations.</p>
              </section>
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">3. Restrictions</h2>
                <p>You may not use the platform for any illegal purpose, attempt to reverse engineer our optimization algorithms, or bypass our security measures.</p>
              </section>
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">4. Limitation of Liability</h2>
                <p>PromptRepeat is provided &quot;as is&quot;. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
              </section>
            </div>
            <p className="mt-20 text-xs text-ink/30 uppercase tracking-widest font-bold">Last Updated: February 2024</p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
