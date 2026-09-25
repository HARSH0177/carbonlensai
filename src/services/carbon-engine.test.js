import { describe, it, expect } from 'vitest';
import {
  estimateFromSliders,
  getGrade,
  getTreeEquivalence,
  getFallbackResult,
  getCategoryAverage,
  generateLocalFutures
} from './carbon-engine';

describe('Carbon Engine Services', () => {
  it('estimateFromSliders calculates correctly for defaults', () => {
    const state = { diet: 50, transport: 50, ac: 4, foodDelivery: 5 };
    const result = estimateFromSliders(state);
    // Diet: 15 + (0.5 * 30) = 30
    // Transport: 8 + (0.5 * 112) = 64
    // AC: 4 * 10 = 40
    // Food Delivery: 5 * 2 = 10
    // Total = 144
    expect(result).toBe(144);
  });

  it('getGrade assigns correct grades', () => {
    expect(getGrade(0.5, 'meal')).toBe('A');
    expect(getGrade(3, 'meal')).toBe('C');
    expect(getGrade(10, 'meal')).toBe('E');
  });

  it('getTreeEquivalence returns correct string', () => {
    expect(getTreeEquivalence(21)).toBe('1.0 trees needed to offset annually');
    expect(getTreeEquivalence(42)).toBe('2.0 trees needed to offset annually');
  });

  it('getCategoryAverage computes arithmetic mean from EMISSION_FACTORS', () => {
    const mealAvg = getCategoryAverage('meal');
    expect(mealAvg).toBeGreaterThan(0);
    expect(typeof mealAvg).toBe('number');
  });

  it('getFallbackResult returns a programmatic offline estimate with notice', () => {
    const result = getFallbackResult('meal');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('estimatedCarbonKg');
    expect(result.isOfflineEstimate).toBe(true);
    expect(result.notice).toContain('Offline estimate');
    expect(result.estimatedCarbonKg).toBe(getCategoryAverage('meal'));
  });

  it('generateLocalFutures creates dynamic strings', () => {
    const state = { diet: 10, transport: 10, ac: 2, foodDelivery: 1 };
    const result = generateLocalFutures(state);
    
    expect(result).toHaveProperty('futureLetter');
    expect(result).toHaveProperty('cityImpact');
    expect(result).toHaveProperty('treeStat');
    expect(result).toHaveProperty('imagePrompt');
    expect(result.imagePrompt).toContain('A bright futuristic eco-utopia');
  });
});
