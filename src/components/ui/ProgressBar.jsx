import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, color, className = '', height = 'h-2' }) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className={`w-full rounded-full overflow-hidden ${height} ${className}`} style={{ background: '#E5E7EB' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${normalizedValue}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color || 'var(--leaf)' }}
      />
    </div>
  );
}
