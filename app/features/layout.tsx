import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore PromptRepeat features — adaptive repetition, neural reasoning, entropy monitoring, and more.',
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
