// Alle DB-kald samlet ét sted (nemt at vedligeholde)
import { supabase } from "./supabaseClient";
import type { Session, CreateSessionData } from "./types";

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

export async function getSessionById(id: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();
    if (error) throw error;
  return (data as Session) ?? null;
}

export async function createSession(sessionData: CreateSessionData): Promise<Session> {
  const { data, error } = await supabase
    .from("sessions")
    .insert(sessionData)
    .select()
    .single();
  if (error) throw error;
  return data as Session;
}

export async function updateSession(id: string, sessionData: Partial<CreateSessionData>): Promise<Session> {
  const { data, error } = await supabase
    .from("sessions")
    .update(sessionData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Session;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

