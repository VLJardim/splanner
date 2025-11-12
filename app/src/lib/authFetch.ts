import { supabase } from "@/src/lib/supabaseClient";

export async function authFetch(url: string, init: RequestInit = {}) {
  const { data: sess } = await supabase.auth.getSession();
  const token = sess?.session?.access_token;

  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
