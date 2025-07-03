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

  // Handle localhost development (including subdomains)
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".")
    if (parts.length > 1 && parts[0] !== "localhost") {
      const subdomain = parts[0]
      const newUrl = new URL(`/${subdomain}${url.pathname}`, req.url)
      return NextResponse.rewrite(newUrl)
    }
    return res
  }

  // Check if this is the main domain
  const isMainDomain = hostname === "displan.design" || hostname === "www.displan.design"

  if (isMainDomain) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return res
    }

    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          get(name) {
            return req.cookies.get(name)?.value
          },
          set(name, value, options) {
            req.cookies.set({ name, value, ...options })
            res.cookies.set({ name, value, ...options })
          },
          remove(name, options) {
            req.cookies.delete({ name, ...options })
            res.cookies.delete({ name, ...options })
          },
        },
      })

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const protectedPaths = ["/dashboard", "/profile", "/project"]
      const isProtectedPath = protectedPaths.some((prefix) => url.pathname.startsWith(prefix))

      if (isProtectedPath && !session) {
        const redirectUrl = new URL("/sign-in", req.url)
        redirectUrl.searchParams.set("message", "Please sign in to access this page")
        return NextResponse.redirect(redirectUrl)
      }
    } catch (e) {
      console.error("Middleware error:", e)
      return res
    }

    return res
  }

  // For subdomains, rewrite the path
  const subdomain = hostname.split(".")[0]
  const newUrl = new URL(`/${subdomain}${url.pathname}`, req.url)
  return NextResponse.rewrite(newUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
