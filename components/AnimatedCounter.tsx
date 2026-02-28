'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useInView } from 'motion/react';

interface AnimatedCounterProps {
  target: string;
  className?: string;
  duration?: number;
}

export default function AnimatedCounter({ target, className = '', duration = 2000 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState('0');

  const parsed = useMemo(() => {
    const match = target.match(/^([\d,.]+)(.*)/);
    if (!match) return null;
    const numStr = match[1].replace(/,/g, '');
    const suffix = match[2];
    const end = parseFloat(numStr);
    const isDecimal = numStr.includes('.');
    const decimals = isDecimal ? (numStr.split('.')[1]?.length || 0) : 0;
    return { end, suffix, isDecimal, decimals };
  }, [target]);

  useEffect(() => {
    if (!isInView) return;

    // Non-numeric target — display as-is
    if (!parsed) {
      // Use requestAnimationFrame to avoid synchronous setState in effect
      const id = requestAnimationFrame(() => setDisplay(target));
      return () => cancelAnimationFrame(id);
    }

    const { end, suffix, isDecimal, decimals } = parsed;
    let startTime: number;
    let frameId: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      if (isDecimal) {
        setDisplay(current.toFixed(decimals) + suffix);
      } else {
        setDisplay(Math.round(current).toLocaleString() + suffix);
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isInView, target, duration, parsed]);

  return <span ref={ref} className={className}>{display}</span>;
}
