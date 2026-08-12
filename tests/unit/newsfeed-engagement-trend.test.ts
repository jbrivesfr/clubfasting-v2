import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../../src/app/api/newsfeed/engagement-trend/route';
import { NextResponse } from 'next/server';

const mockGetUser = vi.fn();
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockGte = vi.fn();
const mockLte = vi.fn();

vi.mock('@/utils/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser
    },
    from: mockFrom
  })
}));

describe('GET /api/newsfeed/engagement-trend', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-08-14T12:00:00Z')); // Wednesday

    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ gte: mockGte });
    mockGte.mockReturnValue({ lte: mockLte });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should return 401 if not admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { role: 'user' } },
      error: null
    });

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it('should return 401 if user error', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Auth error')
    });

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it('should calculate deltas correctly with a 2-week fixture', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { role: 'admin' } },
      error: null
    });

    mockLte.mockResolvedValue({
      data: [
        // Previous week: 2024-08-05 to 2024-08-11
        { date: '2024-08-06', posts: 10, comments: 20, likes: 30 },
        { date: '2024-08-10', posts: 5, comments: 10, likes: 15 },
        // Current week: 2024-08-12 to 2024-08-14
        { date: '2024-08-12', posts: 20, comments: 50, likes: 10 },
        { date: '2024-08-13', posts: 10, comments: 20, likes: 5 }
      ],
      error: null
    });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);

    // Previous week totals: posts=15, comments=30, likes=45
    expect(json.previous_week.posts_count).toBe(15);
    expect(json.previous_week.comments_count).toBe(30);
    expect(json.previous_week.reactions_count).toBe(45);

    // Current week totals: posts=30, comments=70, likes=15
    expect(json.current_week.posts_count).toBe(30);
    expect(json.current_week.comments_count).toBe(70);
    expect(json.current_week.reactions_count).toBe(15);

    // Deltas
    expect(json.delta.posts.abs).toBe(15); // 30 - 15
    expect(json.delta.posts.percent).toBe(100); // 15 / 15 * 100

    expect(json.delta.comments.abs).toBe(40); // 70 - 30
    expect(json.delta.comments.percent).toBeCloseTo(133.33, 1); // 40 / 30 * 100

    expect(json.delta.reactions.abs).toBe(-30); // 15 - 45
    expect(json.delta.reactions.percent).toBeCloseTo(-66.67, 1); // -30 / 45 * 100

    // is_up check: 2/3 are up (posts, comments)
    expect(json.is_up).toBe(true);
  });

  it('should set is_up to false if less than 2/3 metrics are up', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { role: 'admin' } },
      error: null
    });

    mockLte.mockResolvedValue({
      data: [
        // Previous week
        { date: '2024-08-06', posts: 20, comments: 50, likes: 50 },
        // Current week
        { date: '2024-08-12', posts: 10, comments: 20, likes: 60 },
      ],
      error: null
    });

    const response = await GET();
    const json = await response.json();

    // posts down, comments down, likes up -> 1/3 -> false
    expect(json.is_up).toBe(false);
  });

  it('should handle empty weeks correctly (division by zero)', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { role: 'admin' } },
      error: null
    });

    // No data -> all 0
    mockLte.mockResolvedValue({
      data: [],
      error: null
    });

    const response = await GET();
    const json = await response.json();

    expect(json.delta.posts.percent).toBe(0);
    expect(json.delta.comments.percent).toBe(0);
    expect(json.delta.reactions.percent).toBe(0);
    expect(json.is_up).toBe(false);
  });

  it('should handle previous week 0, current week > 0', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { role: 'admin' } },
      error: null
    });

    mockLte.mockResolvedValue({
      data: [
        // Current week only
        { date: '2024-08-12', posts: 10, comments: 20, likes: 10 },
      ],
      error: null
    });

    const response = await GET();
    const json = await response.json();

    expect(json.delta.posts.percent).toBe(100);
    expect(json.delta.comments.percent).toBe(100);
    expect(json.delta.reactions.percent).toBe(100);
    expect(json.is_up).toBe(true);
  });
});
