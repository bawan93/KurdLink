import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Routes that require the user to be logged in
const PROTECTED = [
  '/listings/sell-business',
  '/listings/sell-car',
  '/listings/hire-staff',
  '/listings/list-service',
]

export async function middleware(request) {
  const { pathname, searchParams } = request.nextUrl
  const response = NextResponse.next()

  // Check if this is a protected route
  const isProtected = PROTECTED.some(route => pathname.startsWith(route))
  if (!isProtected) return response

  // Create Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Not logged in — redirect to onboarding with redirect param
    const redirectUrl = new URL('/onboarding', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/listings/:path*',
  ]
}