import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const hostname = req.headers.get("host") || ""
  
  // Skip subdomain handling for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return res
  }
  
  // Handle authentication for protected routes on main domain
  if (hostname === "displan.design" || hostname === "www.displan.design") {
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
  }
  
  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}