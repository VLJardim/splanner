// Alle DB-kald samlet ét sted (nemt at vedligeholde)
import { supabase } from "./supabaseClient";
import type { Session } from "./types";

export async function listPublicUpcoming(): Promise<Session[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Session[];
}

export async function getBySlug(slug: string): Promise<Session | null> {
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return (data as Session) ?? null;
}

export async function listMine(userId: string): Promise<Session[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("owner", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Session[];
}
