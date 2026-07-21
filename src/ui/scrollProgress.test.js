import { describe, expect, it } from 'vitest';
import { damp, normalizeScroll } from './scrollProgress.js';

describe('normalizeScroll', () => {
  it('maps top to 0 and bottom to 1', () => {
    expect(normalizeScroll(0, 3000, 800)).toBe(0);
    expect(normalizeScroll(2200, 3000, 800)).toBe(1);
  });

  it('clamps overscroll and handles unscrollable pages', () => {
    expect(normalizeScroll(-50, 3000, 800)).toBe(0);
    expect(normalizeScroll(9999, 3000, 800)).toBe(1);
    expect(normalizeScroll(0, 800, 800)).toBe(0);
  });
});

describe('damp', () => {
  it('moves a fraction toward the target', () => {
    expect(damp(0, 1, 0.08)).toBeCloseTo(0.08);
    expect(damp(0.5, 0.5, 0.08)).toBe(0.5);
  });
});
