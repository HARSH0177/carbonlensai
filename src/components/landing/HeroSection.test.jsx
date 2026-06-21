import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from './HeroSection';

describe('HeroSection Component', () => {
  it('renders the main heading', () => {
    // IntersectionObserver isn't in jsdom, mock it if needed by framer-motion
    window.IntersectionObserver = vi.fn().mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });

    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    // Verify text exists
    expect(screen.getByText(/See your impact./i)).toBeInTheDocument();
    expect(screen.getByText(/Transform your future./i)).toBeInTheDocument();
  });

  it('renders call to action buttons', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    expect(screen.getByText(/Scan Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Try the Demo/i)).toBeInTheDocument();
  });
});
