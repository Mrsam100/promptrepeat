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
                <p>PromptRepeat stores your prompts, optimized outputs, and model responses to provide features such as prompt history, analytics, and dashboard insights. Prompt text is truncated at 10,000 characters and outputs at 20,000 characters. All data is encrypted in transit via TLS. You can permanently delete all of your stored data at any time by deleting your account from the Settings page.</p>
              </section>
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">3. Security</h2>
                <p>We implement industry-standard security practices including encrypted connections (TLS), hashed passwords (bcrypt), and JWT-based authentication. Your data is stored in a secure PostgreSQL database with access restricted to authenticated sessions.</p>
              </section>
              <section>
                <h2 className="text-2xl font-display font-medium text-ink mb-4">4. Third Parties</h2>
                <p>We do not sell your data. We only share data with third-party LLM providers as required to execute your requests.</p>
              </section>
            </div>
            <p className="mt-20 text-xs text-ink/30 uppercase tracking-widest font-bold">Last Updated: February 2026</p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
