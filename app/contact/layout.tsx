import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the PromptRepeat team for questions, support, or partnerships.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
