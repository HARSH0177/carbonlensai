import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false, type = 'button' }) {
  const styles = {
    primary: { background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff', boxShadow: '0 8px 24px rgba(34,197,94,0.25)' },
    secondary: { background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--muted)' },
    ghost: { background: 'transparent', color: 'var(--foreground)' },
    outline: { background: 'transparent', color: 'var(--primary)', border: '2px solid var(--primary)' }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-bold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{ ...styles[variant], focusRingColor: 'var(--primary)' }}
    >
      {children}
    </motion.button>
  );
}
