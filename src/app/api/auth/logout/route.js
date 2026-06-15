import { NextResponse } from 'next/server'

const THIRTY_DAYS = 30 * 24 * 60 * 60

export async function POST(request) {
  const response = NextResponse.json({ success: true })

  // Clear auth cookies
  response.cookies.set('logemail', '', { path: '/', maxAge: 0, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  response.cookies.set('username', '', { path: '/', maxAge: 0, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  response.cookies.set('description', '', { path: '/', maxAge: 0, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })

  return response
}
