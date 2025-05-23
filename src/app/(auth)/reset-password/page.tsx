import { resetPasswordAction } from "@/app/actions"
import Navbar from "@/components/navbar"
import "../style12.css"

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const error = searchParams.error ? String(searchParams.error) : null
  const message = searchParams.message ? String(searchParams.message) : null

  return (
    <>
      <div className="flex min-h-screen">
        {/* Left side - Reset form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-[32px] font-medium text-black leading-[48px] mb-1">
              Reset your password
            </h1>
            <p className="text-[16px] font-medium text-black leading-[24px] mb-10">
              Enter your email and new password
            </p>

            <form action={resetPasswordAction} method="POST" className="w-full">
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

              <div className="mb-5">
                <label className="text-[14px] font-medium text-black leading-[21px]" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  required
                  className="w-full px-3 py-2 h-[32px] text-[10px] placeholder:text-[#d9d9d9] border border-[#d9d9d9] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#3a5b22]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-[32px] text-[13px] font-bold bg-[#3a5b22] text-white border border-[#3a5b22] rounded-[10px] transition-colors duration-200 focus:outline-none"
              >
                Reset Password
              </button>

              {(error || message) && (
                <div
                  className={`p-3 mt-4 text-sm rounded-md ${
                    error ? "bg-red-500/20 text-red-200" : "bg-green-500/20 text-green-200"
                  }`}
                >
                  {error || message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="/images/img_chrislee70l1tdai6rmunsplash_2.png"
            alt="Reset"
            className="absolute inset-0 h-full w-full object-cover rounded-tl-[45px] rounded-br-[45px]"
          />
        </div>
      </div>
    </>
  )
}
