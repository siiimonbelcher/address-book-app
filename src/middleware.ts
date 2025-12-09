import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't need auth
  const publicPaths = ['/', '/login', '/register']
  const isPublicPath = publicPaths.some(path => pathname === path)

  // Protected paths
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/contacts')

  // Get session cookie (NextAuth v4 cookie names)
  const sessionCookie = request.cookies.get('next-auth.session-token') ||
                       request.cookies.get('__Secure-next-auth.session-token')

  // If trying to access protected path without session
  if (isProtectedPath && !sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (sessionCookie && (pathname === '/login' || pathname === '/register')) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
