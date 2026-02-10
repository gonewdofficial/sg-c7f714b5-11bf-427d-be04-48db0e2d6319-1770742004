import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  fullName?: string;
  avatarUrl?: string;
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Fetch user profile with role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      role: profile?.role || "user",
      fullName: profile?.full_name || "",
      avatarUrl: profile?.avatar_url || "",
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, fullName?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Create profile entry
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || "",
          role: "user",
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user role
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("id", data.user.id)
        .single();

      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          role: profile?.role || "user",
          fullName: profile?.full_name || "",
          avatarUrl: profile?.avatar_url || "",
        },
        error: null,
      };
    }

    return { user: null, error: "User not found" };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.role === "admin";
  } catch (error) {
    return false;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(updates: {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
}) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
        phone: updates.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}