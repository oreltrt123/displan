import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const url = req.nextUrl
  const hostname = req.headers.get("host") || ""

  // Skip API routes
  if (url.pathname.startsWith("/api/")) {
    return res
  }

  // IMPORTANT: Skip middleware for localhost during development
  if (hostname === "localhost:3000") {
    return res
  }

  // Check if this is a custom domain or a subdomain
  const isMainDomain = hostname === "displan.design" || hostname === "www.displan.design"

  // Skip subdomain handling for main domain
  if (isMainDomain) {
    // Handle authentication for protected routes on main domain
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res
    }

    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          get(name) {
            return req.cookies.get(name)?.value
          },
          set(name, value, options) {
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
            req.cookies.delete({
              name,
              ...options,
            })
            res.cookies.delete({
              name,
              ...options,
            })
          },
        },
      })

      await supabase.auth.getSession()

      const path = req.nextUrl.pathname
      const protectedPaths = ["/dashboard", "/profile", "/project"]
      const isProtectedPath = protectedPaths.some((prefix) => path.startsWith(prefix))

      if (isProtectedPath) {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          const redirectUrl = new URL("/sign-in", req.url)
          redirectUrl.searchParams.set("message", "Please sign in to access this page")
          return NextResponse.redirect(redirectUrl)
        }
      }
    } catch (e) {
      console.error("Middleware error:", e)
    }

    return res
  }

  // For subdomains, extract the subdomain and rewrite to the [domain] route
  const subdomain = hostname.split(".")[0]
  const newUrl = new URL(`/${subdomain}${url.pathname}`, req.url)
  return NextResponse.rewrite(newUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
