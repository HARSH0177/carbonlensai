import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Camera } from 'lucide-react';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16">
      {/* Magic UI style Animated Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--background)]">
        <motion.div 
          style={{ y: y1, background: 'var(--teal)' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-[100px] blur-[100px]" 
        />
        <motion.div 
          style={{ y: y2, background: 'var(--leaf)' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] right-[-10%] w-[55%] h-[55%] rounded-[100px] blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], opacity: [0.25, 0.35, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-15%] left-[20%] w-[50%] h-[50%] rounded-[100px] blur-[90px]" 
          style={{ background: 'var(--sage)' }} 
        />
        <div className="absolute inset-0 backdrop-blur-[50px] bg-white/10" />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 100 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-[24px] font-medium mb-12 border bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] transition-all cursor-pointer"
          style={{ color: 'var(--forest)', borderColor: 'var(--green-100)' }}
        >
          <Leaf className="w-5 h-5" style={{ color: 'var(--moss)' }} />
          <span className="text-sm tracking-wide font-semibold uppercase">Next-Gen Sustainability</span>
        </motion.div>

        {/* Hero Title */}
        <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] mb-10 tracking-tight" style={{ color: 'var(--forest)' }}>
          <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="block">
            See your impact.
          </motion.span>
          <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="block bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--teal), var(--moss))' }}>
            Transform your future.
          </motion.span>
        </h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.5 }} 
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed" 
          style={{ color: 'var(--foreground)', opacity: 0.8 }}
        >
          No more tedious manual logging. CarbonLensAI uses computer vision to instantly estimate the carbon footprint of your meals, receipts, and lifestyle from a single photo.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }} 
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
        >
          <Link 
            to="/scan" 
            className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 text-white rounded-[24px] font-bold text-lg overflow-hidden transition-all hover:scale-[1.02]" 
            style={{ background: 'linear-gradient(135deg, var(--teal), var(--moss))', boxShadow: '0 20px 40px -10px rgba(34,197,94,0.4)' }}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Camera className="w-6 h-6" />
            <span>Scan Now</span>
          </Link>
          
          <Link 
            to="/auth" 
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-white rounded-[24px] font-bold text-lg transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(8,145,178,0.1)] border border-gray-100 hover:border-[var(--teal)]" 
            style={{ color: 'var(--forest)' }}
          >
            <span>Try the Demo</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none pointer-events-none -z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[150px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.35,187.5,102.5,233.91,87.89,279.71,68.7,321.39,56.44Z" style={{ fill: 'white' }}></path>
        </svg>
      </div>
    </section>
  );
}
