import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../../src/app/api/newsfeed/engagement/route'
import { NextRequest } from 'next/server'

vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>()
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        }
      }),
    },
  }
})

const mockGetUser = vi.fn()
const mockSelect = vi.fn()
const mockGte = vi.fn()
const mockFrom = vi.fn()

vi.mock('../../src/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

function createMockRequest(url: string, cookies: Record<string, string> = {}) {
  const req = new NextRequest(url)
  Object.entries(cookies).forEach(([key, value]) => {
    req.cookies.set(key, value)
  })
  return req
}

describe('GET /api/newsfeed/engagement', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default session mock for supabase
    mockGetUser.mockResolvedValue({ data: { user: { email: 'test@example.com' } } })

    mockFrom.mockImplementation((table) => {
      const gte = vi.fn().mockImplementation(() => {
        if (table === 'posts') {
          return Promise.resolve({ data: null, count: 10, error: null })
        } else if (table === 'comments') {
          return Promise.resolve({ data: null, count: 20, error: null })
        } else if (table === 'reactions') {
          return Promise.resolve({ data: null, count: 30, error: null })
        }
        return Promise.resolve({ data: null, count: 0, error: null })
      })

      const range = vi.fn().mockResolvedValue({
         data: [{ user_id: 'user1' }, { user_id: 'user1' }, { user_id: 'user2' }],
         error: null,
      })

      const select = vi.fn().mockImplementation((selectString) => {
        if (table === 'reactions' && selectString === 'user_id') {
           return {
             gte: vi.fn().mockReturnValue({
               range: range
             })
           }
        }
        return { gte }
      })
      return { select }
    })
  })

  it('returns 401 when no session is present', async () => {
    const req = createMockRequest('http://localhost/api/newsfeed/engagement')
    mockGetUser.mockResolvedValueOnce({ data: { user: null } })

    const response: any = await GET(req)
    expect(response.status).toBe(401)

    const data = await response.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 400 on bad days parameter', async () => {
    const req = createMockRequest('http://localhost/api/newsfeed/engagement?days=91', { logemail: 'test@example.com' })

    const response: any = await GET(req)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain('days parameter must be an integer between 1 and 90')
  })

  it('returns 400 on negative days parameter', async () => {
    const req = createMockRequest('http://localhost/api/newsfeed/engagement?days=-5', { logemail: 'test@example.com' })

    const response: any = await GET(req)
    expect(response.status).toBe(400)
  })

  it('returns 400 on non-integer days parameter', async () => {
    const req = createMockRequest('http://localhost/api/newsfeed/engagement?days=abc', { logemail: 'test@example.com' })

    const response: any = await GET(req)
    expect(response.status).toBe(400)
  })

  it('returns 200 with correct shape for valid session and default days', async () => {
    const req = createMockRequest('http://localhost/api/newsfeed/engagement', { logemail: 'test@example.com' })

    const response: any = await GET(req)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.posts).toBe(10)
    expect(data.comments).toBe(20)
    expect(data.reactions).toBe(30)
    expect(data.unique_active_users).toBe(2) // user1, user2
    expect(data.window_days).toBe(7)
    expect(data.since).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  it('returns 200 with correct shape for valid session and specific days', async () => {
    const req = createMockRequest('http://localhost/api/newsfeed/engagement?days=30', { logemail: 'test@example.com' })

    const response: any = await GET(req)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.window_days).toBe(30)
  })
})
