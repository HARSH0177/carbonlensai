import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ScanProvider } from './context/ScanContext';
import { SettingsProvider } from './context/SettingsContext';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import InsightsPage from './pages/InsightsPage';
import SimulatorPage from './pages/SimulatorPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ProfilePage from './pages/ProfilePage';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnimatedBackground from './components/common/AnimatedBackground';

export default function App() {
  const location = useLocation();
  const showNav = location.pathname !== '/' && location.pathname !== '/auth';

  return (
    <AuthProvider>
      <SettingsProvider>
        <ScanProvider>
          <AnimatedBackground />
          <div className="flex flex-col min-h-screen">
            {showNav && <Navbar />}
            
            <main className={`flex-grow ${showNav ? 'pt-16' : ''}`}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/scan" element={<ScanPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/simulator" element={<SimulatorPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </AnimatePresence>
            </main>

            {showNav && <Footer />}
          </div>
        </ScanProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
