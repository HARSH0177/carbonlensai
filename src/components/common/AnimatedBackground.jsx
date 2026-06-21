import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[var(--background)]">
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-[100px] blur-[100px] opacity-20 will-change-transform"
        style={{ background: 'var(--primary)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-[100px] blur-[90px] opacity-20 will-change-transform"
        style={{ background: 'var(--secondary)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], y: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[20%] left-[30%] w-[35vw] h-[35vw] rounded-[100px] blur-[80px] opacity-15 will-change-transform"
        style={{ background: 'var(--accent)' }}
      />
      <div className="absolute inset-0 backdrop-blur-[30px] bg-white/5" />
    </div>
  );
}
