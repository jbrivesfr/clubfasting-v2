import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const THIRTY_DAYS = 30 * 24 * 60 * 60
const PUBLIC_PATHS = ['/login', '/register', '/auth/callback', '/auth/confirm', '/', '/favicon.ico', '/sitemap-contenus', '/sitemap.xml', '/jeune-intermittent-16-8', '/jeune-intermittent-18-6', '/newsfeed', '/api/healthcheck-pages', '/methodes-jeune', '/quiz', '/merci']

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.startsWith('/api/health') || pathname.startsWith('/newsfeed/') || pathname.startsWith('/api/og/newsfeed') || pathname.startsWith('/api/quiz/lead')
  )
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, {
              ...options,
              maxAge: options.maxAge || THIRTY_DAYS,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          })
        },
      },
    }
  )

  // Check for Supabase session
  const { data: { user } } = await supabase.auth.getUser()

  // Check for V1-style cookie auth
  const logemailCookie = request.cookies.get('logemail')

  // If no auth at all and not a public path, redirect to login
  if (!user && !logemailCookie && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If has cookie auth but no Supabase session, try to refresh/create session
  if (logemailCookie && !user && !isPublicPath(pathname)) {
    // Refresh Supabase session if possible
    try {
      await supabase.auth.getUser()
    } catch {
      // Cookie auth is sufficient — continue
    }
  }

  // Auto-redirect logged-in users away from login page
  if ((user || logemailCookie) && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
