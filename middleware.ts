import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Admin routes are protected at the layout/server level — middleware just adds a header
  if (pathname.startsWith('/admin')) {
    const res = NextResponse.next()
    res.headers.set('x-pathname', pathname)
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
