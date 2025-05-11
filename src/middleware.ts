import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res
  }

  try {
    // Create supabase server client
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          // If the cookie is updated, update the cookies for the request and response
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          })
          res.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    })

    // Refresh the session
    await supabase.auth.getSession()

    // For protected routes, check if user is authenticated
    const path = req.nextUrl.pathname

    // List of paths that require authentication
    const protectedPaths = ["/dashboard", "/profile", "/project"]

    // Check if the current path starts with any protected path
    const isProtectedPath = protectedPaths.some((prefix) => path.startsWith(prefix))

    if (isProtectedPath) {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Redirect to login if not authenticated
        const redirectUrl = new URL("/sign-in", req.url)
        redirectUrl.searchParams.set("message", "Please sign in to access this page")
        return NextResponse.redirect(redirectUrl)
      }
    }
  } catch (e) {
    // If there's an error, just continue without blocking the request
    console.error("Middleware error:", e)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/payments/webhook).*)",
  ],
}
