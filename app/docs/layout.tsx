import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'PromptRepeat API reference, SDK guides, and integration documentation.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
