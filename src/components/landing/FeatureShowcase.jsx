import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Droplet, Clock, Sprout } from 'lucide-react';
import Card from '../ui/Card';

const features = [
  { icon: <Camera size={28} />, color: 'var(--teal)', title: 'Zero-Logging Tracking', description: 'Take a photo of your meal or scan a bill. Gemini AI detects items and calculates your footprint instantly.' },
  { icon: <Droplet size={28} />, color: 'var(--moss)', title: 'Actionable Swaps', description: 'Get immediate, simple swaps like "Replace chicken with paneer" with CO₂ and monetary savings.' },
  { icon: <Clock size={28} />, color: 'var(--leaf)', title: 'Futures Engine', description: 'Curious about long-term impact? See a letter from your 2050 self based on current habits.' },
  { icon: <Sprout size={28} />, color: 'var(--forest)', title: 'Interactive Simulator', description: 'Play with sliders for diet, transport, and AC usage to see how small changes add up.' }
];

export default function FeatureShowcase() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>How CarbonLens Works</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>A frictionless loop designed to build awareness and drive real behavior change.</p>
        </div>
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 40, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } } }} whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}>
              <Card hover className="h-full">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'var(--green-50)', color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--forest)' }}>{f.title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{f.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
