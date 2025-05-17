import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const url = req.nextUrl
  const hostname = req.headers.get("host") || ""
  
  // Define main domain
  const mainDomain = "displan.design"
  
  // Check if this is a subdomain request
  // Handle both formats: www.[subdomain].displan.design and [subdomain].displan.design
  let subdomain: string | null = null
  
  // Format: www.[subdomain].displan.design
  const wwwSubdomainMatch = hostname.match(new RegExp(`^www\\.([^.]+)\\.${mainDomain.replace(/\./g, '\\.')}$`))
  
  // Format: [subdomain].displan.design
  const subdomainMatch = hostname.match(new RegExp(`^([^.]+)\\.${mainDomain.replace(/\./g, '\\.')}$`))
  
  if (wwwSubdomainMatch) {
    subdomain = wwwSubdomainMatch[1]
  } else if (subdomainMatch && !hostname.startsWith("www.")) {
    subdomain = subdomainMatch[1]
  }
  
  // If this is a subdomain request, rewrite to the API route
  if (subdomain) {
    console.log(`Serving site for subdomain: ${subdomain}`)
    
    // Create a new URL for the rewrite
    const rewriteUrl = new URL(`/api/sites/${subdomain}`, req.url)
    
    // Return the rewrite response
    return NextResponse.rewrite(rewriteUrl)
  }
  
  // Supabase session/auth handling
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
    console.error("Middleware error:", e)
  }
  
  return res
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public (public files)
    // - api/payments/webhook (your webhook route)
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}