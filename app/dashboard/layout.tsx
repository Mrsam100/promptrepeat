import type { Metadata } from 'next';
import DashboardShell from './DashboardShell';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'PromptRepeat dashboard — manage prompts, view analytics, and optimize your AI workflows.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
