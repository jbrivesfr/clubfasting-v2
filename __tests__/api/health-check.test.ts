import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../../src/app/api/health-check/route';
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

describe('GET /api/health-check', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('returns ok=true when all URLs are healthy and posts to log', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
      // simulate fast network
      vi.advanceTimersByTime(50);
      return { status: 200, ok: true } as Response;
    });

    const request = new Request('http://localhost:3000/api/health-check');
    const response = await GET(request) as any;

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.results).toHaveLength(5);
    data.results.forEach((result: any) => {
      expect(result.status_code).toBe(200);
      expect(result.is_healthy).toBe(true);
      expect(result.error).toBeNull();
    });

    // 5 checks + 5 internal POSTs to /api/health-check/log
    expect(fetchSpy).toHaveBeenCalledTimes(10);
  });

  it('returns ok=false when one or more URLs fail', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
      if (url === 'https://fasting.fr/') {
        return { status: 500, ok: false } as Response;
      }
      return { status: 200, ok: true } as Response;
    });

    const request = new Request('http://localhost:3000/api/health-check');
    const response = await GET(request) as any;

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(data.results).toHaveLength(5);

    const fastingFr = data.results.find((r: any) => r.url === 'https://fasting.fr/');
    expect(fastingFr.status_code).toBe(500);
    expect(fastingFr.is_healthy).toBe(false);

    expect(fetchSpy).toHaveBeenCalledTimes(10);
  });
});
