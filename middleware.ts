import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/chat", "/voice", "/settings"]

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/onboarding"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user has auth token
  const token = request.cookies.get("chatbot_access_token")?.value

  // Allow public routes and API routes
  if (publicRoutes.includes(pathname) || pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next()
  }

  // Redirect to login if accessing protected route without token
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to home if accessing login/register with valid token
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
