'use client';

import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part and suffix (e.g., "1B+" → num=1, suffix="B+")
    const match = target.match(/^([\d,.]+)(.*)/);
    if (!match) {
      setDisplay(target);
      return;
    }

    const numStr = match[1].replace(/,/g, '');
    const suffix = match[2];
    const end = parseFloat(numStr);
    const isDecimal = numStr.includes('.');
    const decimals = isDecimal ? (numStr.split('.')[1]?.length || 0) : 0;

    let startTime: number;
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
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}
