import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Create initial response
  let res = NextResponse.next()

  
  const user = req.cookies.get('user')
  // console.log("user",user);

  
  const { pathname } = req.nextUrl

  // Define public routes
  const isPublicRoute = pathname === '/' || pathname === '/auth/login' || pathname === '/auth/signup'

  // ✅ Case 1: User is logged in & tries to access a public route
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/pages/dashboard', req.url))
  }

  // ❌ Case 2: User is NOT logged in & tries to access a protected route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // ✅ Default: allow access
  return res
}
export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico|images|fonts|manifest.json|robots.txt|sitemap.xml).*)',
  ],
}
