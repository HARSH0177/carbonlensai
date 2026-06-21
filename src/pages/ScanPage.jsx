import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';

export default function ScanPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanType, setScanType] = useState('meal');

  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const processFile = (file) => { if (file?.type.startsWith('image/')) { setSelectedFile(file); const reader = new FileReader(); reader.onload = (e) => setPreviewUrl(e.target.result); reader.readAsDataURL(file); } };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); };
  const handleChange = (e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); };
  const clearSelection = () => { setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; };
  const handleAnalyze = () => { if (selectedFile) navigate('/results', { state: { file: selectedFile, previewUrl, scanType } }); };

  const scanTypes = ['meal', 'grocery', 'receipt', 'electricity_bill'];

  return (
    <PageWrapper className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Scan Your Impact</h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>Upload a photo of your meal, a grocery receipt, or an electricity bill. Our AI will analyze it instantly.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {scanTypes.map((type) => (
          <button key={type} onClick={() => setScanType(type)} className="px-5 py-2 rounded-full font-medium transition-all border"
            style={{ background: scanType === type ? 'var(--forest)' : '#fff', color: scanType === type ? '#fff' : 'var(--muted)', borderColor: scanType === type ? 'var(--forest)' : '#E5E7EB', boxShadow: scanType === type ? '0 4px 14px rgba(11,36,20,0.2)' : 'none' }}>
            {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
          </button>
        ))}
      </div>

      <Card className="max-w-2xl mx-auto" variant="glass">
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl transition-colors"
              style={{ borderColor: dragActive ? 'var(--leaf)' : '#D1D5DB', background: dragActive ? 'var(--green-50)' : 'transparent' }}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-20 h-20 mb-6 bg-white rounded-full shadow-md flex items-center justify-center" style={{ color: 'var(--leaf)' }}>
                  <Camera size={36} strokeWidth={1.5} />
                </div>
                <p className="mb-2 text-xl font-bold" style={{ color: 'var(--forest)' }}>Click to snap or upload</p>
                <p className="text-sm text-gray-400">or drag and drop an image here</p>
              </div>
            </motion.form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <div className="relative w-full max-h-[400px] rounded-2xl overflow-hidden mb-8 shadow-inner border border-gray-100">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-gray-50" />
                <button onClick={clearSelection} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-gray-600 hover:text-red-500 transition-colors shadow-md">
                  <X size={20} />
                </button>
              </div>
              <button onClick={handleAnalyze} className="flex items-center gap-2 px-8 py-4 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, var(--leaf), var(--teal))', boxShadow: '0 8px 30px rgba(22,163,74,0.3)' }}>
                <Zap size={20} /> Analyze {scanType.replace('_', ' ')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </PageWrapper>
  );
}
