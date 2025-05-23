import { createClient } from "../../../../../supabase/server"; // Adjust import if needed
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=missing_code", requestUrl.origin));
  }

  try {
    const supabase = createClient(); // Make sure this returns a working supabase client
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code:", error.message);
      return NextResponse.redirect(
        new URL("/sign-in?error=auth_failed", requestUrl.origin)
      );
    }

    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  } catch (err) {
    console.error("Unexpected error during OAuth callback:", err);
    return NextResponse.redirect(
      new URL("/sign-in?error=server_error", requestUrl.origin)
    );
  }
}
