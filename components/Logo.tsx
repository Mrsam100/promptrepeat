'use client';

import { motion } from 'motion/react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`${className} relative group cursor-pointer flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Pixelated 'M' shape */}
        <motion.path
          d="M20 80V20H40L50 40L60 20H80V80H65V45L50 65L35 45V80H20Z"
          fill="currentColor"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Decorative Pixel Dots */}
        <motion.rect
          x="10" y="10" width="5" height="5"
          fill="var(--color-primary)"
          animate={{ 
            opacity: [0.4, 1, 0.4],
            y: [0, -4, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.rect
          x="85" y="10" width="5" height="5"
          fill="var(--color-retro-red)"
          animate={{ 
            opacity: [0.4, 1, 0.4],
            y: [0, 4, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.rect
          x="10" y="85" width="5" height="5"
          fill="var(--color-retro-yellow)"
          animate={{ 
            opacity: [0.4, 1, 0.4],
            y: [0, 4, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.rect
          x="85" y="85" width="5" height="5"
          fill="var(--color-accent)"
          animate={{ 
            opacity: [0.4, 1, 0.4],
            y: [0, -4, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
      </svg>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-primary/5 rounded-lg scale-0 group-hover:scale-125 transition-transform duration-300 -z-10"></div>
    </div>
  );
}
