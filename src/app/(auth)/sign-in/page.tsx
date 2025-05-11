import { signInAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import Link from "next/link";

interface SignInPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  const error = searchParams.error ? String(searchParams.error) : null;
  const message = searchParams.message ? String(searchParams.message) : null;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <form action={signInAction} className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight" data-i18n="signIn">
                Sign in
              </h1>
              <p className="text-sm text-muted-foreground">
                <span data-i18n="dontHaveAccount">Don't have an account?</span>{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-up"
                  data-i18n="signUp"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium" data-i18n="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium" data-i18n="password">
                    Password
                  </label>
                  <Link
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
                    href="/forgot-password"
                    data-i18n="forgotPassword"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-5 py-3 text-base tracking-tight no-underline bg-white font-[560] rounded-[100px] text-black hover:bg-opacity-90 transition-opacity"
              data-i18n="signIn"
            >
              Sign in
            </button>

            {(error || message) && (
              <div
                className={`p-3 text-sm rounded-md ${
                  error ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"
                }`}
              >
                {error || message}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
