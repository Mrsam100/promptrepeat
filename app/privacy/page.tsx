'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="pt-48 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-display font-medium text-ink mb-12">Privacy Policy</h1>
            <div className="prose prose-ink max-w-none font-body font-light text-ink/60 leading-relaxed space-y-8">
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">1. Data Collection</h2>
                <p>We collect minimal data necessary to provide our services. This includes account information and metadata related to prompt optimization requests.</p>
              </section>
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">2. Prompt Data</h2>
                <p>PromptRepeat does not store the content of your prompts or model outputs unless explicitly requested for debugging purposes. All data is processed in-memory and encrypted in transit.</p>
              </section>
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">3. Security</h2>
                <p>We implement enterprise-grade security protocols, including end-to-end encryption and regular SOC2 compliance audits.</p>
              </section>
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">4. Third Parties</h2>
                <p>We do not sell your data. We only share data with third-party LLM providers as required to execute your requests.</p>
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
