import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about PromptRepeat — the team and mission behind universal prompt optimization.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
