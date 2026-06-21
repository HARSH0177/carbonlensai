import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Leaf, Wind, RefreshCw, Loader2, TreePine } from 'lucide-react';
import { generateFutures } from '../services/gemini';
import { estimateFromSliders } from '../services/carbon-engine';
import { useScan } from '../context/ScanContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';

// BUG FIX #2 (helper): Build a pure-integer Pollinations seed.
//
// The original code used a hyphenated string seed:
//   "50-80-4-5-1782015291"
// Pollinations parses seed values as integers. parseInt("50-80-4-5-...") = 50
// — it stops at the first hyphen, discarding everything after it, including the
// timestamp that was supposed to cache-bust each new call.
// The practical result:
//   • Transport, AC, and food-delivery slider moves were invisible to Pollinations.
//   • The timestamp never changed the effective seed.
//   • The same diet-derived seed → same cached image returned every time.
//
// This function produces a single integer that encodes all four sliders and
// the current Unix timestamp, so every new futures call generates a genuinely
// different image.
function buildPollinationsSeed(state) {
  // Hash the sliders to keep the seed within a safe 32-bit unsigned integer range (0 to 4,294,967,295)
  // Maximum value is guaranteed to be under 100 million
  const base = (state.diet * 3) + (state.transport * 7) + (state.ac * 11) + (state.foodDelivery * 13);
  const timestamp = Math.floor(Date.now() / 1000);
  return (base * 1000 + (timestamp % 100000)) % 100000000;
}

// BUG FIX #4 (helper): parseFloat(futures.treeStat) silently returns NaN
// when Gemini returns text like "You need about 73 trees to offset...".
// Use a regex to extract the first number from whatever string arrives.
function parseTreeStat(treeStat, fallback) {
  if (!treeStat) return fallback;
  const match = treeStat.match(/[\d]+(?:\.\d+)?/);
  return match ? parseFloat(match[0]).toFixed(0) : fallback;
}

export default function SimulatorPage() {
  const [sliderState, setSliderState] = useState({ diet: 50, transport: 50, ac: 4, foodDelivery: 5 });
  const [debouncedState, setDebouncedState] = useState(sliderState);
  const [includeScans, setIncludeScans] = useState(false);
  const [futures, setFutures] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [liveEmissions, setLiveEmissions] = useState(0);
  
  const { totalCO2 } = useScan();

  useEffect(() => { 
    const baseEmissions = estimateFromSliders(sliderState);
    setLiveEmissions(baseEmissions + (includeScans ? totalCO2 : 0)); 
  }, [sliderState, includeScans, totalCO2]);

  useEffect(() => { const t = setTimeout(() => setDebouncedState(sliderState), 400); return () => clearTimeout(t); }, [sliderState]);

  useEffect(() => {
    let m = true;
    (async () => { setIsGenerating(true); const r = await generateFutures(debouncedState); if (m) { setFutures(r); setIsGenerating(false); } })();
    return () => { m = false; };
  }, [debouncedState]);

  useEffect(() => {
    if (futures?.imagePrompt) {
      // BUG FIX #2: Use a pure-integer seed (see buildPollinationsSeed above).
      const seed = buildPollinationsSeed(debouncedState);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(futures.imagePrompt)}?width=800&height=400&nologo=true&seed=${seed}`;
      setImageSrc(url);
      setIsImageLoading(true);
    }
  }, [futures]);

  const handleSlider = (e, key) => setSliderState(p => ({ ...p, [key]: parseFloat(e.target.value) }));

  // BUG FIX #4: Use parseTreeStat instead of raw parseFloat to handle
  // variable Gemini response phrasing without silently returning NaN.
  const fallbackTrees = ((liveEmissions * 12) / 21).toFixed(0);
  const treesNeeded = futures ? parseTreeStat(futures.treeStat, fallbackTrees) : fallbackTrees;

  const sliders = [
    { key: 'diet', label: 'Diet', min: 0, max: 100, left: 'Vegetarian', right: 'Non-Vegetarian', display: sliderState.diet < 20 ? 'Mostly Veg' : sliderState.diet > 80 ? 'Heavy Meat' : 'Mixed' },
    { key: 'transport', label: 'Transport', min: 0, max: 100, left: 'Metro/Bus', right: 'Private Car', display: sliderState.transport < 20 ? 'Public Transit' : sliderState.transport > 80 ? 'Personal Car' : 'Mixed' },
    { key: 'ac', label: 'AC Usage (Daily)', min: 0, max: 12, step: 1, left: 'Rare', right: 'All Day', display: `${sliderState.ac} hours` },
    { key: 'foodDelivery', label: 'Food Delivery (Monthly)', min: 0, max: 30, step: 1, left: 'Cook at home', right: 'Daily', display: `${sliderState.foodDelivery} times` }
  ];

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>What-If Simulator</h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>Adjust your daily habits. Watch how small changes multiply over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Card variant="glass" className="sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Sliders size={20} style={{ color: 'var(--leaf)' }} />
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Your Habits</h2>
            </div>
            <div className="space-y-8">
              {sliders.map(s => (
                <div key={s.key}>
                  <div className="flex justify-between text-sm font-medium mb-3">
                    <span style={{ color: 'var(--forest)' }}>{s.label}</span>
                    <span style={{ color: 'var(--muted)' }}>{s.display}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step || 1} value={sliderState[s.key]} onChange={(e) => handleSlider(e, s.key)} className="w-full" />
                  <div className="flex justify-between text-xs mt-2 font-medium" style={{ color: 'var(--muted)' }}>
                    <span>{s.left}</span><span>{s.right}</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--forest)' }}>Include Scan History</h3>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Add {totalCO2.toFixed(1)} kg from your uploaded scans to the simulation.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={includeScans} onChange={() => setIncludeScans(!includeScans)} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--leaf)]"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {/* Live Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, var(--leaf), var(--teal))' }}>
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">Monthly Emissions</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{liveEmissions.toFixed(0)}</span>
                <span className="text-lg text-white/70 mb-1">kg CO₂e</span>
              </div>
            </div>
            <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: 'var(--forest)' }}>
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                Trees Needed
                {isGenerating && <Loader2 size={14} className="animate-spin text-white/60" />}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--sage)' }}>{treesNeeded}</span>
                <span className="text-lg text-white/70 mb-1">/ year</span>
              </div>
            </div>
          </div>

          {/* Futures Engine */}
          <Card variant="glass" className="relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Wind size={200} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>
                  <span className="text-2xl">🔮</span> Carbon Futures Engine
                </h2>
                {isGenerating && (
                  <span className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full animate-pulse" style={{ color: 'var(--muted)', background: 'var(--green-50)' }}>
                    <RefreshCw size={12} className="animate-spin" /> Regenerating...
                  </span>
                )}
              </div>

              {/* Dynamic Image Storytelling */}
              <div className="w-full h-64 rounded-2xl overflow-hidden mb-8 shadow-inner relative bg-gray-100">
                {imageSrc ? (
                  <img
                    // BUG FIX (secondary): Adding key={imageSrc} forces React to
                    // unmount+remount the <img> element whenever the URL changes.
                    // Without this, if setImageSrc is called with a URL that React
                    // deems unchanged (same string), onLoad never fires and the
                    // loading overlay gets permanently stuck.
                    key={imageSrc}
                    src={imageSrc} 
                    alt="Future City" 
                    className={`w-full h-full object-cover bg-gray-200 transition-all duration-700 ${isGenerating || isImageLoading ? 'blur-md scale-105' : 'blur-0 scale-100'}`}
                    onLoad={() => setIsImageLoading(false)}
                    onError={(e) => {
                      if (e.target.src.includes('seed=')) {
                        e.target.onerror = null;
                        setIsImageLoading(true);
                        // BUG FIX #2 (fallback): also use a numeric seed here
                        const fallbackSeed = buildPollinationsSeed(sliderState);
                        e.target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent("A futuristic eco city with modern architecture and green parks")}?width=800&height=400&nologo=true&seed=${fallbackSeed}`;
                      } else {
                        setIsImageLoading(false);
                      }
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                  </div>
                )}

                {/* Loading overlay */}
                {(isGenerating || isImageLoading) && (
                  <div className="absolute inset-0 bg-black/35 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-3 transition-opacity duration-300">
                    <div className="p-3 bg-white/20 rounded-full animate-bounce">
                      <RefreshCw size={24} className="animate-spin text-white" />
                    </div>
                    <span className="text-sm font-semibold tracking-wider drop-shadow-md">
                      {isGenerating ? "Simulating futures..." : "Visualizing future city..."}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className="text-white text-sm font-medium italic drop-shadow-sm">
                    AI visualization of your future city...
                  </p>
                </div>
              </div>

              <div className={`transition-opacity duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--leaf)' }} /> Letter from 2050
                  </h3>
                  <p className="text-lg leading-relaxed italic p-6 rounded-2xl border border-gray-100" style={{ fontFamily: 'Georgia, serif', color: 'var(--forest)', background: 'var(--green-50)' }}>
                    "{futures?.futureLetter || 'Loading your future...'}"
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--teal)' }} /> City Impact Scale
                  </h3>
                  <div className="flex gap-4 items-start p-6 rounded-2xl border border-gray-100 bg-white">
                    <Leaf className="flex-shrink-0 mt-1" size={24} style={{ color: 'var(--teal)' }} />
                    <p className="leading-relaxed" style={{ color: 'var(--forest)' }}>{futures?.cityImpact || 'Calculating city impact...'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
