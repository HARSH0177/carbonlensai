import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertCircle, Info, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useScan } from '../context/ScanContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/common/EmptyState';
import { formatCO2, formatCurrency, getCategoryIcon } from '../utils/formatters';

export default function DashboardPage() {
  const { user, isGuest } = useAuth();
  const { recentScans, totalCO2, avgGrade, scanCount } = useScan();
  const navigate = useNavigate();
  const totalCost = totalCO2 * 15;

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>
            Hello, {user?.displayName?.split(' ')[0] || 'Explorer'} 👋
          </h1>
          <p style={{ color: 'var(--muted)' }} className="mt-1">
            {isGuest ? 'You are exploring in Demo Mode.' : 'Here is your carbon snapshot.'}
          </p>
        </div>
        <button onClick={() => navigate('/scan')} className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 transition-all" style={{ background: 'var(--leaf)', boxShadow: '0 4px 14px rgba(22,163,74,0.25)' }}>
          <Camera size={20} /> New Scan
        </button>
      </div>

      {isGuest && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-amber-800">Demo Mode Active</h4>
            <p className="text-sm text-amber-700 mt-1">Viewing pre-loaded demo data. <button onClick={() => navigate('/auth')} className="underline font-medium">Sign in</button> to save your own scans.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card variant="glass" className="relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={80} style={{ color: 'var(--leaf)' }} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Total Estimated</p>
            <span className="text-4xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>{formatCO2(totalCO2)}</span>
            <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>from {scanCount} scans</p>
          </div>
        </Card>

        <Card variant="glass">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Average Grade</p>
          <div className="flex items-center gap-4">
            <Badge grade={avgGrade} size="lg" />
            <p className="text-sm max-w-[120px]" style={{ color: 'var(--muted)' }}>Based on your recent activities</p>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Environmental Cost</p>
            <Info size={16} style={{ color: 'var(--muted)' }} className="cursor-help" />
          </div>
          <span className="text-4xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>{formatCurrency(totalCost)}</span>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Hidden cost to the planet</p>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Recent Scans</h2>
          {recentScans.length > 0 && (
            <button onClick={() => navigate('/history')} className="text-sm font-semibold" style={{ color: 'var(--leaf)' }}>View All →</button>
          )}
        </div>

        {recentScans.length === 0 ? (
          <EmptyState icon={Camera} title="No scans yet" description="Start by scanning your meals, grocery bills, or travel receipts." actionText="Start Scanning" actionIcon={Camera} onAction={() => navigate('/scan')} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentScans.map((scan) => (
              <Card key={scan.id} hover onClick={() => navigate('/history')} className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl" style={{ background: 'var(--green-50)' }}>
                    {getCategoryIcon(scan.inputType)}
                  </div>
                  <Badge grade={scan.carbonGrade} size="md" />
                </div>
                <h3 className="font-bold mb-1 truncate" style={{ color: 'var(--forest)' }}>{scan.title}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{formatCO2(scan.estimatedCarbonKg)}</p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium line-clamp-2" style={{ color: 'var(--leaf)' }}>{scan.recommendation}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
