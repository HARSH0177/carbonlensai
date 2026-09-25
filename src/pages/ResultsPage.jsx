import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, ArrowLeft, TreePine, Banknote, AlertTriangle } from 'lucide-react';
import { analyzeImage } from '../services/gemini';
import { useScan } from '../context/ScanContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addScan } = useScan();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { file, previewUrl, scanType } = location.state || {};

  useEffect(() => {
    if (!file || !previewUrl) return;
    let isMounted = true;
    const runAnalysis = async () => {
      try {
        setLoading(true);
        const [analysisResult] = await Promise.all([analyzeImage(file, scanType), new Promise(res => setTimeout(res, 2000))]);
        if (isMounted) { setResult(analysisResult); addScan({ ...analysisResult, title: scanType === 'meal' ? 'Meal Scan' : 'Document Scan', imageUrl: previewUrl }); setLoading(false); }
      } catch (err) { if (isMounted) { setError('Failed to analyze. Please try again.'); setLoading(false); } }
    };
    runAnalysis();
    return () => { isMounted = false; };
  }, [file, previewUrl, scanType]);

  if (!location.state) return <Navigate to="/scan" replace />;

  if (loading) {
    return (
      <PageWrapper className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-2xl overflow-hidden p-1" style={{ border: '2px solid var(--leaf)' }}>
            <img src={previewUrl} alt="Analyzing" className="w-full h-full object-cover rounded-xl opacity-50 grayscale" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'var(--leaf)' }}><Loader2 size={32} className="animate-spin" /></div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center animate-pulse" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Gemini AI is analyzing your scan...</h2>
        <p className="text-center max-w-sm" style={{ color: 'var(--muted)' }}>Identifying items, calculating footprint, and generating personalized insights.</p>
      </PageWrapper>
    );
  }

  if (error || !result) {
    return (
      <PageWrapper className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button onClick={() => navigate('/scan')} className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Try Again</button>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-6 transition-colors" style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-2">
            <div className="relative rounded-xl overflow-hidden aspect-square bg-gray-100">
              <img src={previewUrl} alt="Scanned" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm" style={{ color: 'var(--forest)' }}>
                {(result.confidence * 100).toFixed(0)}% Match
              </div>
            </div>
          </Card>
          <Card className="border-none" style={{ background: 'linear-gradient(135deg, var(--green-50), #fff)' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Detected Items</h3>
            <ul className="space-y-2">
              {result.detectedItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 font-medium" style={{ color: 'var(--forest)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--leaf)' }} />
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="lg:col-span-7 space-y-6">
          <Card variant="glass">
            {result.isOfflineEstimate && (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-800 text-xs font-medium">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>{result.notice || 'Offline estimate — live AI analysis unavailable. Footprint derived from category factor tables.'}</span>
              </div>
            )}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>
                  {result.isOfflineEstimate ? 'Offline Estimate' : 'Analysis Complete'}
                </h1>
                <p style={{ color: 'var(--muted)' }}>
                  {result.isOfflineEstimate ? 'Standard category baseline calculation.' : 'Estimated environmental impact.'}
                </p>
              </div>
              <Badge grade={result.carbonGrade} size="lg" className="-mt-2 ring-4 ring-white" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl border border-gray-100" style={{ background: 'var(--green-50)' }}>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--muted)' }}>Estimated Footprint</p>
                <p className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>{result.estimatedCarbonKg.toFixed(1)} <span className="text-base font-normal">kg CO₂e</span></p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100" style={{ background: 'var(--green-50)' }}>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--muted)' }}>Tree Equivalence</p>
                <div className="flex items-center gap-2 mt-1">
                  <TreePine size={24} style={{ color: 'var(--leaf)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--forest)' }}>{result.treeEquivalence}</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--forest)' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ background: 'var(--leaf)' }}>1</span> The Story
                </h4>
                <p className="leading-relaxed pl-8" style={{ color: 'var(--muted)' }}>{result.carbonStory}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--forest)' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ background: 'var(--leaf)' }}>2</span> Future Impact
                </h4>
                <p className="leading-relaxed pl-8" style={{ color: 'var(--muted)' }}>{result.futureImpact}</p>
              </div>
              <div className="p-5 rounded-xl relative overflow-hidden" style={{ background: 'var(--green-50)', border: '1px solid var(--green-100)' }}>
                <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--forest)' }}>💡 Actionable Swap</h4>
                <p className="font-medium mb-4" style={{ color: 'var(--forest)' }}>{result.recommendation}</p>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100 text-sm font-semibold" style={{ color: 'var(--forest)' }}>
                  <Banknote size={16} className="text-green-600" /> {result.rupeeEquivalent}
                </span>
              </div>
            </div>
          </Card>
          <div className="flex justify-end gap-4 mt-8">
            <button onClick={() => navigate('/simulator')} className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors" style={{ color: 'var(--forest)' }}>Play with Simulator</button>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 text-white rounded-xl font-semibold transition-all hover:scale-[1.02]" style={{ background: 'var(--forest)', boxShadow: '0 4px 14px rgba(11,36,20,0.2)' }}>Save & Continue</button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
