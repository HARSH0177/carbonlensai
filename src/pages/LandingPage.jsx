import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import HeroSection from '../components/landing/HeroSection';
import FeatureShowcase from '../components/landing/FeatureShowcase';

export default function LandingPage() {
  return (
    <PageWrapper>
      <div className="min-h-screen">
        <HeroSection />
        <FeatureShowcase />
      </div>
    </PageWrapper>
  );
}
