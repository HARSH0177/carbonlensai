import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-2">
        <p className="font-semibold flex items-center gap-1.5" style={{ color: 'var(--forest)' }}>
          CarbonLensAI © 2026
        </p>
        <p className="text-sm text-gray-400 flex items-center gap-1">
          Built with <Heart size={14} className="text-red-400 fill-red-400" /> for Hackathon | Powered by Gemini AI
        </p>
      </div>
    </footer>
  );
}
