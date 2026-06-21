import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Calendar, Zap, Trash2, ArrowRight } from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { formatCO2, formatDate, getCategoryIcon, getGradeColor } from '../utils/formatters';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/common/EmptyState';

export default function HistoryPage() {
  const { scans, clearScans } = useScan();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filteredScans = scans.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'meal') return s.inputType === 'meal';
    if (filter === 'utility') return s.inputType?.includes('bill') || s.inputType === 'receipt';
    return true;
  });

  const filterBtns = [{ key: 'all', label: 'All Scans' }, { key: 'meal', label: 'Meals & Food' }, { key: 'utility', label: 'Bills & Receipts' }];

  return (
    <PageWrapper className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Scan History</h1>
          <p style={{ color: 'var(--muted)' }}>Review past scans and track progress over time.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {filterBtns.map(fb => (
            <button key={fb.key} onClick={() => setFilter(fb.key)} className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all" style={{ background: filter === fb.key ? 'var(--forest)' : '#fff', color: filter === fb.key ? '#fff' : 'var(--muted)', border: filter === fb.key ? 'none' : '1px solid #E5E7EB' }}>
              {fb.label}
            </button>
          ))}
        </div>
      </div>

      {scans.length === 0 ? (
        <EmptyState icon={Camera} title="No history yet" description="Your scan history will appear here once you start taking photos." actionText="Take a Scan" actionIcon={Camera} onAction={() => navigate('/scan')} />
      ) : (
        <div className="space-y-4">
          {filteredScans.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No scans found for this filter.</div>
          ) : filteredScans.map(scan => (
            <Card key={scan.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl text-4xl" style={{ background: 'var(--green-50)' }}>
                  {getCategoryIcon(scan.inputType)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-lg" style={{ color: 'var(--forest)' }}>{scan.title}</h3>
                    <Badge grade={scan.carbonGrade} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-3" style={{ color: 'var(--muted)' }}>
                    <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(scan.date)}</span>
                    <span className="flex items-center gap-1 font-medium" style={{ color: getGradeColor(scan.carbonGrade) }}><Zap size={14} />{formatCO2(scan.estimatedCarbonKg)}</span>
                  </div>
                  <p className="text-sm p-3 rounded-lg border border-gray-100" style={{ color: 'var(--forest)', background: 'var(--green-50)' }}>
                    <span className="font-semibold mr-2" style={{ color: 'var(--leaf)' }}>Tip:</span>{scan.recommendation}
                  </p>
                </div>
                <div className="hidden sm:block flex-shrink-0">
                  <button className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors" style={{ color: 'var(--muted)' }}><ArrowRight size={20} /></button>
                </div>
              </div>
            </Card>
          ))}
          {scans.length > 0 && (
            <div className="mt-12 text-center">
              <button onClick={clearScans} className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} /> Clear History
              </button>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
