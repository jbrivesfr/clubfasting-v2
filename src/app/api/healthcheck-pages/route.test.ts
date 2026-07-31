import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from './route';
import { NextResponse } from 'next/server';

// Mock NextResponse
vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: vi.fn((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

describe('GET /api/healthcheck-pages', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('returns ok=true for fast 200 responses', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async () => {
      // simulate fast network
      vi.advanceTimersByTime(100);
      return { status: 200 } as Response;
    });

    const response = await GET() as any;
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveLength(3);
    data.forEach((result: any) => {
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.latencyMs).toBeGreaterThanOrEqual(100);
      expect(result.latencyMs).toBeLessThan(5000);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it('returns ok=false for slow responses (>5s)', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async () => {
      // simulate slow network
      vi.advanceTimersByTime(5500);
      return { status: 200 } as Response;
    });

    const response = await GET() as any;
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveLength(3);
    data.forEach((result: any) => {
      expect(result.ok).toBe(false);
      expect(result.status).toBe(200);
      expect(result.latencyMs).toBeGreaterThanOrEqual(5500);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it('returns ok=false when fetch throws an exception', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async () => {
      throw new Error('Network error');
    });

    const response = await GET() as any;
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveLength(3);
    data.forEach((result: any) => {
      expect(result.ok).toBe(false);
      expect(result.status).toBe(0);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });
});
