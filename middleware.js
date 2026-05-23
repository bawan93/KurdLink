import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Only admin route needs protection now
const PROTECTED = ['/admin']

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  const isProtected = PROTECTED.some(route => pathname.startsWith(route))
  if (!isProtected) return response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*']
}