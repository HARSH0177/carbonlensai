import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, actionText, onAction, actionIcon: ActionIcon }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-3xl"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--green-50)', color: 'var(--leaf)' }}>
        {Icon && <Icon size={40} strokeWidth={1.5} />}
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>{title}</h3>
      <p className="text-gray-500 max-w-sm mb-8">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          style={{ background: 'var(--leaf)', boxShadow: '0 4px 14px rgba(22,163,74,0.25)' }}
        >
          {ActionIcon && <ActionIcon size={18} />}
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
