import React from "react";
import { updateSession } from "./supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const path = url.pathname;

  // Define subdomains and their paths
  const subdomains = {
    blog: "/blog",
    docs: "/docs",
  };

  // Check if we're on a subdomain
  const subdomain = hostname.split(".")[0];

  // Handle subdomain routing
  if (subdomain in subdomains) {
    const subPath = subdomains[subdomain as keyof typeof subdomains];
    url.pathname = `${subPath}${path === "/" ? "" : path}`;
    return NextResponse.rewrite(url);
  }

  // Continue with the regular auth session handling
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
