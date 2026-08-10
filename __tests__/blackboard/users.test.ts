import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLastUsers, BlackboardFetchError } from '../../src/lib/blackboard/fetchers/users';
import { createClient } from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

describe('fetchLastUsers', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  });

  it('should return the last 5 users correctly mapped', async () => {
    const mockUsers = [
      { id: '1', email: 'user1@test.com', created_at: '2023-01-01T00:00:00Z', last_sign_in_at: '2023-01-01T00:00:00Z' },
      { id: '2', email: 'user2@test.com', created_at: '2023-01-02T00:00:00Z', last_sign_in_at: '2023-01-02T00:00:00Z' },
      { id: '3', email: 'user3@test.com', created_at: '2023-01-03T00:00:00Z', last_sign_in_at: '2023-01-03T00:00:00Z' },
      { id: '4', email: 'user4@test.com', created_at: '2023-01-04T00:00:00Z', last_sign_in_at: '2023-01-04T00:00:00Z' },
      { id: '5', email: 'user5@test.com', created_at: '2023-01-05T00:00:00Z', last_sign_in_at: '2023-01-05T00:00:00Z' },
      { id: '6', email: 'user6@test.com', created_at: '2023-01-06T00:00:00Z', last_sign_in_at: '2023-01-06T00:00:00Z' },
    ];

    const mockAdminAuth = {
      listUsers: vi.fn().mockResolvedValue({
        data: { users: mockUsers },
        error: null,
      }),
    };

    (createClient as any).mockReturnValue({
      auth: {
        admin: mockAdminAuth,
      },
    });

    const result = await fetchLastUsers();

    expect(result).toHaveLength(5);
    // User 6 is the most recent
    expect(result[0].id).toBe('6');
    expect(result[1].id).toBe('5');
    expect(result[4].id).toBe('2');
  });

  it('should throw BlackboardFetchError if Supabase returns an error', async () => {
    const mockAdminAuth = {
      listUsers: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database failure' },
      }),
    };

    (createClient as any).mockReturnValue({
      auth: {
        admin: mockAdminAuth,
      },
    });

    await expect(fetchLastUsers()).rejects.toThrow(BlackboardFetchError);
    await expect(fetchLastUsers()).rejects.toThrow('Failed to fetch users: Database failure');
  });

  it('should return empty array if env vars are missing', async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const result = await fetchLastUsers();
    expect(result).toEqual([]);
  });
});