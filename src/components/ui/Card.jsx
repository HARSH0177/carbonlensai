import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', variant = 'default', hover = false, onClick }) {
  const variantStyles = {
    default: {},
    glass: {},
    gradient: { background: 'linear-gradient(135deg, var(--leaf), var(--teal))', color: '#fff', border: 'none' }
  };

  const variantClasses = {
    default: 'bg-white border border-[var(--muted)] shadow-[0_4px_24px_rgba(8,145,178,0.04)]',
    glass: 'bg-white/70 backdrop-blur-[24px] border border-white/50 shadow-[0_8px_32px_rgba(8,145,178,0.06)]',
    gradient: 'shadow-[0_12px_40px_rgba(34,197,94,0.15)]'
  };

  const base = `rounded-[24px] p-8 overflow-hidden ${variantClasses[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`;

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className={`${base} hover:shadow-md transition-shadow`}
        style={variantStyles[variant]}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} style={variantStyles[variant]}>
      {children}
    </div>
  );
}
