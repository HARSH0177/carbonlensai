import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, Circle } from 'lucide-react';
import { RECOMMENDATIONS } from '../data/recommendations';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';

export default function RecommendationsPage() {
  const [completed, setCompleted] = useState(new Set());
  const toggle = (id) => setCompleted(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const diffColors = { easy: { bg: '#DCFCE7', text: '#166534' }, medium: { bg: '#FEF9C3', text: '#854D0E' }, hard: { bg: '#FEE2E2', text: '#991B1B' } };

  return (
    <PageWrapper className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--green-50)', color: 'var(--leaf)' }}>
          <Lightbulb size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Action Plan</h1>
        <p className="max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>Small habits build big impact. Select a few easy wins for this week.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RECOMMENDATIONS.map(rec => {
          const done = completed.has(rec.id);
          const dc = diffColors[rec.difficulty] || diffColors.easy;
          return (
            <Card key={rec.id} hover onClick={() => toggle(rec.id)} className="transition-all duration-300" style={{ background: done ? 'var(--green-50)' : '#fff', borderColor: done ? 'var(--green-100)' : '#E5E7EB' }}>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1">
                  {done ? <CheckCircle2 size={24} style={{ color: 'var(--leaf)' }} /> : <Circle size={24} className="text-gray-300" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{rec.icon}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider" style={{ background: dc.bg, color: dc.text }}>{rec.difficulty}</span>
                  </div>
                  <h3 className={`font-medium text-lg leading-snug mb-3 ${done ? 'line-through opacity-60' : ''}`} style={{ color: 'var(--forest)' }}>{rec.text}</h3>
                  <div className={`flex flex-wrap gap-3 text-sm font-medium ${done ? 'opacity-40' : ''}`}>
                    <span style={{ color: 'var(--leaf)' }}>🌱 Saves {rec.estimatedCarbonSaved}</span>
                    <span className="text-green-600">💰 Saves ~{rec.moneySaved}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageWrapper>
  );
}
