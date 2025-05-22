import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SmtpMessage } from "../smtp-message"
import { signUpAction } from "@/app/actions"
import Navbar from "@/components/navbar"
import SocialLoginButtons from "@/components/auth/social-login-buttons"
import "../style12.css"

export default async function Signup(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left side - Sign up form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-[32px] font-medium text-black leading-[48px] mb-1" data-i18n="signUp">
              Create an account
            </h1>
            <p className="text-[16px] font-medium text-black leading-[24px] mb-10">
              Join us today and get started with your journey
            </p>

            <form action={signUpAction} className="w-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="full_name"
                    className="text-[14px] font-medium text-black leading-[21px]"
                    data-i18n="fullName"
                  >
                    Full Name
                  </Label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full px-3 py-2 h-[32px] text-[10px] placeholder:text-[#d9d9d9] border border-[#d9d9d9] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#3a5b22]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[14px] font-medium text-black leading-[21px]"
                    data-i18n="email"
                  >
                    Email
                  </Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full px-3 py-2 h-[32px] text-[10px] placeholder:text-[#d9d9d9] border border-[#d9d9d9] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#3a5b22]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[14px] font-medium text-black leading-[21px]"
                    data-i18n="password"
                  >
                    Password
                  </Label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                    className="w-full px-3 py-2 h-[32px] text-[10px] placeholder:text-[#d9d9d9] border border-[#d9d9d9] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#3a5b22]"
                  />
                  <p className="text-[9px] text-gray-500 mt-1">Password must be at least 6 characters long</p>
                </div>

                <div className="mb-5 flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="h-[9px] w-[9px] rounded-[2px] border border-black focus:ring-[#3a5b22] focus:ring-offset-0"
                  />
                  <label htmlFor="terms" className="ml-2 text-[9px] font-medium text-black leading-[13px]">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#0f3cde]">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#0f3cde]">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <SubmitButton
                pendingText="Signing up..."
                className="w-full h-[32px] text-[13px] font-bold bg-[#3a5b22] text-white border border-[#3a5b22] rounded-[10px] transition-colors duration-200 focus:outline-none mt-6"
                data-i18n="signUp"
              >
                Sign up
              </SubmitButton>

              <FormMessage message={searchParams} />

              <SocialLoginButtons />

              <div className="mt-8 text-center">
                <p className="text-[14px] font-medium text-black">
                  <span data-i18n="alreadyHaveAccount">Already have an account?</span>{" "}
                  <Link href="/sign-in" className="text-[#0f3cde]" data-i18n="signIn">
                    Sign in
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
