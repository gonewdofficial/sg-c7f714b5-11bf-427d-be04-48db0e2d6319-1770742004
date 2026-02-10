import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: any;
  created_at?: string;
  role?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

// Dynamic URL Helper
const getURL = () => {
  let url = process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 
           process?.env?.NEXT_PUBLIC_SITE_URL ?? 
           'http://localhost:3000'
  
  // Handle undefined or null url
  if (!url) {
    url = 'http://localhost:3000';
  }
  
  // Ensure url has protocol
  url = url.startsWith('http') ? url : `https://${url}`
  
  // Ensure url ends with slash
  url = url.endsWith('/') ? url : `${url}/`
  
  return url
}

// Get current user
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch profile to get role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || "",
    user_metadata: user.user_metadata,
    created_at: user.created_at,
    role: profile?.role || "guest"
  };
}

// Get current session
export async function getCurrentSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Sign up with email and password
export async function signUp(email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getURL()}auth/confirm-email`
      }
    });

    if (error) {
      return { user: null, error: { message: error.message, code: error.status?.toString() } };
    }

    const authUser = data.user ? {
      id: data.user.id,
      email: data.user.email || "",
      user_metadata: data.user.user_metadata,
      created_at: data.user.created_at
    } : null;

    return { user: authUser, error: null };
  } catch (error) {
    return { 
      user: null, 
      error: { message: "An unexpected error occurred during sign up" } 
    };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message, code: error.status?.toString() } };
    }

    // Fetch profile to get role
    let role = "guest";
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      if (profile) role = profile.role || "guest";
    }

    const authUser = data.user ? {
      id: data.user.id,
      email: data.user.email || "",
      user_metadata: data.user.user_metadata,
      created_at: data.user.created_at,
      role
    } : null;

    return { user: authUser, error: null };
  } catch (error) {
    return { 
      user: null, 
      error: { message: "An unexpected error occurred during sign in" } 
    };
  }
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (error) {
    return { 
      error: { message: "An unexpected error occurred during sign out" } 
    };
  }
}

// Reset password
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}auth/reset-password`,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (error) {
    return { 
      error: { message: "An unexpected error occurred during password reset" } 
    };
  }
}

// Confirm email
export async function confirmEmail(token: string, type: 'signup' | 'recovery' | 'email_change' = 'signup'): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type
    });

    if (error) {
      return { user: null, error: { message: error.message, code: error.status?.toString() } };
    }

    const authUser = data.user ? {
      id: data.user.id,
      email: data.user.email || "",
      user_metadata: data.user.user_metadata,
      created_at: data.user.created_at
    } : null;

    return { user: authUser, error: null };
  } catch (error) {
    return { 
      user: null, 
      error: { message: "An unexpected error occurred during email confirmation" } 
    };
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// Default export for compatibility
export const authService = {
  getCurrentUser,
  getCurrentSession,
  signUp,
  signIn,
  signOut,
  resetPassword,
  confirmEmail,
  onAuthStateChange
};