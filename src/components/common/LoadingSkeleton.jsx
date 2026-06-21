import React from 'react';

export default function LoadingSkeleton({ width = '100%', height = '20px', className = '', rounded = 'rounded-md' }) {
  return (
    <div 
      className={`bg-sage/20 overflow-hidden relative ${rounded} ${className}`}
      style={{ width, height }}
    >
      <div 
        className="absolute inset-0 -translate-x-full"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0) 100%)',
          animation: 'shimmer 2s infinite',
        }}
      />
    </div>
  );
}
