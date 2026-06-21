import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_SCENARIOS } from '../data/demo-scenarios';
import { useAuth } from './AuthContext';

const ScanContext = createContext();

export function ScanProvider({ children }) {
  const { isGuest } = useAuth();
  const [scans, setScans] = useState([]);

  // Seed with demo data if guest
  useEffect(() => {
    if (isGuest && scans.length === 0) {
      const seedScans = DEMO_SCENARIOS.slice(0, 3).map(s => ({
        ...s,
        id: `seed-${s.id}`,
        date: new Date().toISOString()
      }));
      setScans(seedScans);
    }
  }, [isGuest]);

  const addScan = (scanData) => {
    const newScan = {
      ...scanData,
      id: scanData.id || `scan-${Date.now()}`,
      date: new Date().toISOString()
    };
    setScans(prev => [newScan, ...prev]);
  };

  const clearScans = () => {
    setScans([]);
  };

  // Derived state
  const scanCount = scans.length;
  
  const totalCO2 = scans.reduce((acc, scan) => acc + (scan.estimatedCarbonKg || 0), 0);
  
  const getAvgGrade = () => {
    if (scanCount === 0) return 'N/A';
    const gradeValues = { A: 1, B: 2, C: 3, D: 4, E: 5 };
    const avgValue = scans.reduce((acc, scan) => acc + (gradeValues[scan.carbonGrade] || 3), 0) / scanCount;
    if (avgValue <= 1.5) return 'A';
    if (avgValue <= 2.5) return 'B';
    if (avgValue <= 3.5) return 'C';
    if (avgValue <= 4.5) return 'D';
    return 'E';
  };
  
  const avgGrade = getAvgGrade();
  
  const recentScans = scans.slice(0, 4);

  return (
    <ScanContext.Provider value={{ 
      scans, 
      addScan, 
      clearScans, 
      totalCO2, 
      avgGrade, 
      scanCount, 
      recentScans 
    }}>
      {children}
    </ScanContext.Provider>
  );
}

export const useScan = () => useContext(ScanContext);
