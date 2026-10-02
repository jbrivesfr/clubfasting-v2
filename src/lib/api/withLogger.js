import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getEmail(request) {
  try {
    const cookie = request.cookies.get('logemail')
    if (cookie?.value) return decodeURIComponent(cookie.value)

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      })
      const { data } = await supabase.auth.getUser()
      return data?.user?.email || null
    }
  } catch (e) {
    // Ignore error
  }
  return null
}

export function withLogging(handler) {
  return async function(request, ...args) {
    const start = Date.now()
    const request_id = crypto.randomUUID()
    const method = request.method
    const path = request.nextUrl ? request.nextUrl.pathname : request.url

    // We try to extract user_id (email) from session to log it
    // Wait for email to be fetched, but don't fail if we can't
    const user_id = await getEmail(request)

    try {
      let response = await handler(request, ...args)

      const duration_ms = Date.now() - start
      const status = response.status

      // Apply X-Request-Id header to the response
      response.headers.set('X-Request-Id', request_id)

      console.log(JSON.stringify({
        method,
        path,
        user_id,
        request_id,
        duration_ms,
        status
      }))

      return response
    } catch (error) {
      const duration_ms = Date.now() - start
      const status = 500

      console.error(JSON.stringify({
        method,
        path,
        user_id,
        request_id,
        duration_ms,
        status,
        error: error.message,
        stack: error.stack
      }))

      const errorResponse = NextResponse.json(
        {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'An unexpected error occurred',
            request_id
          }
        },
        { status: 500 }
      )

      errorResponse.headers.set('X-Request-Id', request_id)
      return errorResponse
    }
  }
}
