"use server"

import { redirect } from "next/navigation"
import { createClient } from "../../supabase/server"
import { revalidatePath } from "next/cache"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function checkUserSubscription(userId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    return !error && !!data
  } catch (error) {
    return false
  }
}

export async function redirectWithMessage(path: string, message: string, type: "error" | "success" = "error") {
  const params = new URLSearchParams()
  params.set(type, message)
  return redirect(`${path}?${params.toString()}`)
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    redirect("/sign-in?error=Email and password are required")
  }

  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`)
  }

  // ✅ Everything OK — go to dashboard
  redirect("/dashboard")
}

export async function signUpAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = (formData.get("full_name") as string) || ""

  if (!email || !password) {
    return redirectWithMessage("/sign-up", "Email and password are required")
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return redirectWithMessage("/sign-up", error.message)
    }

    return redirectWithMessage("/sign-up", "Account created! Check your email to verify.", "success")
  } catch (error) {
    return redirectWithMessage("/sign-up", "Sign up failed. Please try again.")
  }
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/")
  } catch (error) {
    redirect("/")
  }
}

export async function forgotPasswordAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string

  if (!email) {
    return redirectWithMessage("/forgot-password", "Email is required")
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    })

    if (error) {
      return redirectWithMessage("/forgot-password", error.message)
    }

    return redirectWithMessage("/forgot-password", "Check your email for reset link.", "success")
  } catch (error) {
    return redirectWithMessage("/forgot-password", "Reset failed. Try again.")
  }
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return redirectWithMessage("/reset-password", "Both password fields required")
  }

  if (password !== confirmPassword) {
    return redirectWithMessage("/reset-password", "Passwords do not match")
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return redirectWithMessage("/reset-password", error.message)
    }

    return redirectWithMessage("/reset-password", "Password updated!", "success")
  } catch (error) {
    return redirectWithMessage("/reset-password", "Update failed. Try again.")
  }
}

export async function signInWithGoogleAction(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  })
}
