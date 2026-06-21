import React from 'react';

const gradeConfig = {
  A: { bg: '#22C55E', text: '#fff' },
  B: { bg: '#84CC16', text: '#fff' },
  C: { bg: '#EAB308', text: '#fff' },
  D: { bg: '#F97316', text: '#fff' },
  E: { bg: '#EF4444', text: '#fff' },
};

const sizeConfig = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-11 h-11 text-base',
  lg: 'w-16 h-16 text-2xl',
};

export default function Badge({ grade, size = 'md', className = '' }) {
  const config = gradeConfig[grade] || { bg: '#9CA3AF', text: '#fff' };
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold shadow-sm ${sizeConfig[size]} ${className}`}
      style={{ background: config.bg, color: config.text }}
    >
      {grade || '?'}
    </div>
  );
}
