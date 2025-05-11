"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import { revalidatePath } from "next/cache";

// ✅ New function to check user subscription
export async function checkUserSubscription(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

// Helper function for redirects with messages
export async function redirectWithMessage(
  path: string,
  message: string,
  type: "error" | "success" = "error"
) {
  const params = new URLSearchParams();
  params.set(type, message);
  return redirect(`${path}?${params.toString()}`);
}

// ✅ FIXED: Now returns void (correct type for Next.js form action)
export async function signInAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return redirectWithMessage("/sign-in", "Email and password are required");
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirectWithMessage("/sign-in", error.message);
    }

    if (!data.session) {
      return redirectWithMessage("/sign-in", "Failed to create session");
    }

    revalidatePath("/", "layout");
    return redirect("/dashboard");
  } catch (error) {
    console.error("Sign in error:", error);
    return redirectWithMessage(
      "/sign-in",
      "An unexpected error occurred. Please try again."
    );
  }
}

export async function signUpAction(formData: FormData): Promise<void> {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = (formData.get("full_name") as string) || "";

  if (!email || !password) {
    return redirectWithMessage("/sign-up", "Email and password are required");
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return redirectWithMessage("/sign-up", error.message);
    }

    if (!data.user) {
      return redirectWithMessage("/sign-up", "Failed to create user");
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: data.user.id,
      name: fullName || email.split("@")[0],
      email,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
    }

    return redirectWithMessage(
      "/sign-up",
      "Account created successfully! Please check your email for verification.",
      "success"
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return redirectWithMessage(
      "/sign-up",
      "An unexpected error occurred. Please try again."
    );
  }
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    console.error("Sign out error:", error);
    redirect("/");
  }
}

export async function forgotPasswordAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;

  if (!email) {
    return redirectWithMessage("/forgot-password", "Email is required");
  }

  try {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/reset-password`,
    });

    if (error) {
      return redirectWithMessage("/forgot-password", error.message);
    }

    return redirectWithMessage(
      "/forgot-password",
      "Check your email for a password reset link.",
      "success"
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return redirectWithMessage(
      "/forgot-password",
      "An unexpected error occurred. Please try again."
    );
  }
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return redirectWithMessage(
      "/reset-password",
      "Password and confirmation are required"
    );
  }

  if (password !== confirmPassword) {
    return redirectWithMessage("/reset-password", "Passwords do not match");
  }

  try {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return redirectWithMessage("/reset-password", error.message);
    }

    return redirectWithMessage(
      "/reset-password",
      "Password updated successfully",
      "success"
    );
  } catch (error) {
    console.error("Password update error:", error);
    return redirectWithMessage(
      "/reset-password",
      "An unexpected error occurred. Please try again."
    );
  }
}
