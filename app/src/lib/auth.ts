import { supabase } from './supabaseClient';

// Sign up
export async function signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
}

// Sign in
export async function signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
}

// Sign out
export async function signOut() {
    return await supabase.auth.signOut();
}

// Get current user
export async function getCurrentUser() {
    return await supabase.auth.getUser();
}