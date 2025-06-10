import { signInAction } from "@/app/actions"
import Link from "next/link"
import SocialLoginButtons from "@/components/auth/social-login-buttons"
import "../style12.css"

interface SignInPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  const error = searchParams.error ? String(searchParams.error) : null
  const message = searchParams.message ? String(searchParams.message) : null

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left side - Login form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-[32px] font-medium text-black leading-[48px] mb-1">Welcome back!</h1>
            <p className="text-[16px] font-medium text-black leading-[24px] mb-10">
              Enter your Credentials to access your account
            </p>

            <form action={signInAction} className="w-full">
              <div className="mb-5">
                <label className="text-[14px] font-medium text-black leading-[21px]" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 h-[32px] text-[10px] placeholder:text-[#d9d9d9] border border-[#d9d9d9] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#3a5b22]"
                />
              </div>

              <div className="mb-5 relative">
                <div className="flex justify-between items-center">
                  <label className="text-[14px] font-medium text-black leading-[21px]" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[10px] font-medium text-[#0c2991] leading-[15px]">
                    forgot password
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  required
                  className="w-full px-3 py-2 h-[32px] text-[10px] placeholder:text-[#d9d9d9] border border-[#d9d9d9] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#3a5b22]"
                />
              </div>

              <div className="mb-5 flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  name="remember"
                  className="h-[9px] w-[9px] rounded-[2px] border border-black focus:ring-[#3a5b22] focus:ring-offset-0"
                />
                <label htmlFor="remember-me" className="ml-2 text-[9px] font-medium text-black leading-[13px]">
                  Remember for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-[32px] text-[13px] font-bold bg-[#3a5b22] text-white border border-[#3a5b22] rounded-[10px] transition-colors duration-200 focus:outline-none hover:bg-[#2d4419]"
              >
                Login
              </button>

              {(error || message) && (
                <div
                  className={`p-3 mt-4 text-sm rounded-md ${
                    error
                      ? "bg-red-500/20 text-red-600 border border-red-300"
                      : "bg-green-500/20 text-green-600 border border-green-300"
                  }`}
                >
                  {error || message} <Link className="text-blue-500" href={'/docs/sign_in_failed'}>Learn More</Link>
                </div>
              )}

              <SocialLoginButtons />

              <div className="mt-8 text-center">
                <p className="text-[14px] font-medium text-black">
                  Don't have an account?{" "}
                  <Link href="/sign-up" className="text-[#0f3cde] hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="/images/img_chrislee70l1tdai6rmunsplash_2.png"
            alt="Monstera plant"
            className="absolute inset-0 h-full w-full object-cover rounded-tl-[45px] rounded-br-[45px]"
          />
        </div>
      </div>
    </>
  )
}
