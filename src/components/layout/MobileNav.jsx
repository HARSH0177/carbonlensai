import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, User } from 'lucide-react';

export default function MobileNav({ isOpen, onClose, links, isActive }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 w-[280px] h-full bg-white shadow-2xl z-50 p-6 flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg text-white" style={{ background: 'var(--leaf)' }}>
                  <Leaf size={18} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>
                  CarbonLens<span style={{ color: 'var(--moss)' }}>AI</span>
                </span>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col space-y-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl font-medium transition-all"
                  style={{
                    color: isActive(link.path) ? 'var(--leaf)' : 'var(--forest)',
                    background: isActive(link.path) ? 'var(--green-50)' : 'transparent'
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto border-t border-gray-100 pt-6">
              <Link to="/profile" onClick={onClose} className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--leaf)' }}>
                  <User size={18} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--forest)' }}>Profile</div>
                  <div className="text-xs text-gray-400">Manage your account</div>
                </div>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
