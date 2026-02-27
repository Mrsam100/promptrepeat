import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['200', '400', '500', '700'],
  variable: '--font-dm-sans',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: {
    default: 'PromptRepeat | Universal Prompt Optimization',
    template: '%s | PromptRepeat',
  },
  description: 'Improve LLM accuracy with adaptive prompt repetition middleware.',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body className="antialiased bg-surface text-white font-body selection:bg-primary/20 selection:text-primary overflow-x-hidden">
        <SessionProvider>
          <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] noise-bg"></div>
          <div className="relative z-0">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
