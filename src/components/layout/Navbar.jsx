import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileNav from './MobileNav';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Scan', path: '/scan' },
    { name: 'Simulator', path: '/simulator' },
    { name: 'Insights', path: '/insights' },
    { name: 'History', path: '/history' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 w-full z-40 glass-navbar transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-lg text-white group-hover:scale-105 transition-transform" style={{ background: 'var(--leaf)' }}>
                  <Leaf size={20} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-xl tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>
                  CarbonLens<span style={{ color: 'var(--moss)' }}>AI</span>
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative px-4 py-2 rounded-[24px] text-sm font-bold transition-all duration-300 group"
                  style={{ color: isActive(link.path) ? 'var(--primary)' : 'var(--muted)' }}
                >
                  {isActive(link.path) && (
                    <motion.div 
                      layoutId="nav-pill" 
                      className="absolute inset-0 rounded-[24px] z-[-1]" 
                      style={{ background: 'var(--green-50)' }} 
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}
              <Link to="/profile" className="ml-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--leaf), var(--teal))' }}>
                  ME
                </div>
              </Link>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--forest)' }}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={links}
        isActive={isActive}
      />
    </>
  );
}
