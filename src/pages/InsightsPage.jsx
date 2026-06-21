import React from 'react';
import { useScan } from '../context/ScanContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import EmptyState from '../components/common/EmptyState';
import { Activity } from 'lucide-react';
import { formatCO2 } from '../utils/formatters';

export default function InsightsPage() {
  const { scans, scanCount } = useScan();

  if (scanCount === 0) {
    return (
      <PageWrapper className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Insights</h1>
        <EmptyState icon={Activity} title="No data to analyze" description="Start scanning your activities to unlock personalized insights." />
      </PageWrapper>
    );
  }

  const categoryData = scans.reduce((acc, s) => {
    let cat = 'Other';
    if (s.inputType === 'meal') cat = 'Food';
    else if (s.inputType === 'grocery') cat = 'Groceries';
    else if (s.inputType === 'receipt') cat = 'Shopping';
    else if (s.inputType?.includes('bill')) cat = 'Utilities';
    acc[cat] = (acc[cat] || 0) + s.estimatedCarbonKg;
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(1)) })).sort((a, b) => b.value - a.value);
  const colors = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];
  const total = chartData.reduce((a, b) => a + b.value, 0);

  return (
    <PageWrapper className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Your Impact Breakdown</h1>
        <p style={{ color: 'var(--muted)' }}>Where your emissions come from based on scanned data.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="font-bold mb-6" style={{ color: 'var(--forest)' }}>Emissions by Category (kg CO₂e)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0B2414', fontWeight: 500 }} width={80} />
                <Tooltip cursor={{ fill: '#F0FDF4' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(v) => [`${v} kg`, 'Emissions']} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="space-y-4">
          <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: 'var(--forest)' }}>
            <h3 className="text-white/80 font-semibold uppercase tracking-wider text-sm mb-4">Biggest Contributor</h3>
            <span className="text-4xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{chartData[0]?.name || 'N/A'}</span>
            <p className="mt-2 text-white/70 text-sm">Accounting for {total > 0 ? ((chartData[0].value / total) * 100).toFixed(0) : 0}% of your tracked footprint.</p>
          </div>
          <Card>
            <h3 className="font-bold mb-4" style={{ color: 'var(--forest)' }}>Key Observations</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-white" style={{ background: 'var(--leaf)' }}>1</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>Your <strong style={{ color: 'var(--forest)' }}>{chartData[0]?.name}</strong> category is the highest. Focus on small swaps here.</p>
              </li>
              {chartData.length > 1 && (
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-white" style={{ background: 'var(--leaf)' }}>2</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>Great job on <strong style={{ color: 'var(--forest)' }}>{chartData[chartData.length - 1]?.name}</strong>! Well managed.</p>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
