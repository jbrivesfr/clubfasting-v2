import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import FastingProgressRing from '../../src/components/dashboard/FastingProgressRing';

// Mock the computeFastingState to control the output deterministicly
vi.mock('@/lib/fasting/compute-window', () => ({
  computeFastingState: vi.fn((now, lastMealAt) => {
    if (!lastMealAt) {
      return { hoursElapsed: 0, state: 'pre-window', hoursToGoal: 12 };
    }
    return {
      hoursElapsed: 4,
      state: 'pre-window',
      hoursToGoal: 8,
    };
  }),
}));

describe('FastingProgressRing Accessibility and Motion Preference', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly with no last meal', () => {
    render(<FastingProgressRing lastMealAt={null} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeTruthy();
    expect(progressbar.getAttribute('aria-label')).toBe('Aucun repas enregistré');
  });

  it('renders correctly with a last meal, checking a11y attributes', () => {
    render(<FastingProgressRing lastMealAt={new Date()} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeTruthy();

    const progressValue = progressbar.getAttribute('aria-valuenow');
    expect(progressValue).toBe('25'); // 4h / 16h = 25%

    // Check labelledby links to correct text
    const labelId = progressbar.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    if (labelId) {
      const labelElement = document.getElementById(labelId);
      expect(labelElement?.textContent).toBe('Dernier repas il y a 4h');
    }

    // Check describedby links to remaining time
    const descId = progressbar.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    if (descId) {
      const descElement = document.getElementById(descId);
      expect(descElement?.textContent).toBe("Encore 8h avant l'objectif");
    }
  });

  it('applies motion-reduce to disable animations', () => {
    const { container } = render(<FastingProgressRing lastMealAt={new Date()} />);
    // Select the circle with the transition classes
    const animatedCircle = container.querySelector('circle.transition-all');
    expect(animatedCircle).toBeTruthy();
    // Verify it contains the correct motion-reduce class
    expect(animatedCircle?.getAttribute('class')).toContain('motion-reduce:transition-none');
  });
});
