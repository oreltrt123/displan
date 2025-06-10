import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in", requestUrl.origin)); // or / if you have no login page
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error exchanging code:", error.message);
    return NextResponse.redirect(new URL("/sign-in?error=auth", requestUrl.origin));
  }

  // Always redirect to dashboard on success
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
