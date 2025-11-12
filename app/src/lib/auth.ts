// app/src/lib/auth.ts
import { supabase } from "@/src/lib/supabaseClient";

// Helper: compute role from domain
function roleFromEmail(email: string): "teacher" | "student" {
  return email.toLowerCase().endsWith("@ek.dk") ? "teacher" : "student";
}

export async function signUp(email: string, password: string) {
  // Create the user (client-side)
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  // If signUp returns a session (depends on email confirmation settings), great.
  // If not, sign the user in immediately:
  if (!data.session) {
    const { error: inErr } = await supabase.auth.signInWithPassword({ email, password });
    if (inErr) throw new Error(inErr.message);
  }

  // Now we have a user
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes.user?.email) throw new Error(userErr?.message || "No user after sign up");

  // Compute role from domain and upsert profile
  const role = roleFromEmail(userRes.user.email);
  const { error: upsertErr } = await supabase
    .from("profiles")
    .upsert({ id: userRes.user.id, role }, { onConflict: "id" });
  if (upsertErr) throw new Error(upsertErr.message);

  return { ok: true, role };
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes.user?.email) throw new Error(userErr?.message || "No user after sign in");

  // Compute role from domain and upsert profile (source of truth)
  const role = roleFromEmail(userRes.user.email);
  const { error: upsertErr } = await supabase
    .from("profiles")
    .upsert({ id: userRes.user.id, role }, { onConflict: "id" });
  if (upsertErr) throw new Error(upsertErr.message);

  return { ok: true, role };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return { ok: true };
}
