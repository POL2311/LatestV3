import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const session = await auth()
  
  // If user is not authenticated and trying to access dashboard, redirect to login
  if (!session && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  // If user is authenticated and trying to access login or register, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
  
  // If user is not authenticated and trying to access landing page, allow
  if (!session && pathname === '/') {
    return NextResponse.next()
  }
  
  // If user is authenticated and trying to access landing page, redirect to dashboard
  if (session && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}