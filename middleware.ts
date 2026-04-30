import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import authConfig from './auth.config'
import { rateLimit } from './lib/rate-limit'

const { auth } = NextAuth(authConfig)

const PROTECTED_USER_ROUTES = ['/checkout', '/orders', '/profile']

export default auth(async (req) => {
  const { pathname, search } = req.nextUrl
  const session = req.auth
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isProtectedUser = PROTECTED_USER_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  // Brute-force protection on credentials sign-in. NextAuth handles the
  // route itself, so we gate it from middleware before the handler runs.
  if (pathname === '/api/auth/callback/credentials' && req.method === 'POST') {
    const limited = await rateLimit(req, { limit: 5, windowMs: 60_000, key: 'login' })
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a minute.' },
        { status: 429 },
      )
    }
    return NextResponse.next()
  }

  if (isAdminApi) {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.next()
  }

  if (isAdminRoute) {
    if (!session?.user) {
      const url = new URL('/login', req.url)
      url.searchParams.set('from', pathname + search)
      return NextResponse.redirect(url)
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    const res = NextResponse.next()
    res.headers.set('x-pathname', pathname)
    return res
  }

  if (isProtectedUser && !session?.user) {
    const url = new URL('/login', req.url)
    url.searchParams.set('from', pathname + search)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/auth/callback/credentials',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
  ],
}
