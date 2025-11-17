// app/api/sessions/[id]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Hjælpefunktion: laver en Supabase-klient ud fra requesten
function sbFromRequest(req: NextRequest) {
  // Henter "authorization"-headeren fra requesten, eller tom streng hvis den ikke findes
  const raw = req.headers.get("authorization") || "";
  // Fjerner "Bearer " (med evt. mellemrum) fra starten af tokenet
  const token = raw.replace(/^Bearer\s+/i, "");

  // Opretter en Supabase-klient med public URL og anon key fra miljøvariabler
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Deaktiverer session-persistens og auto-refresh, fordi vi kører på serveren
      auth: { persistSession: false, autoRefreshToken: false },
      // Hvis vi har et token, sender vi det med i alle requests som Authorization-header
      global: token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    }
  );
}

// GET /api/sessions/[id] – hent én session
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Venter på at params-promise bliver resolved, og destrukturerer id
  const { id } = await context.params;

  // Laver Supabase-klient baseret på requesten (for at få auth-token med)
  const sb = sbFromRequest(req);

  // Henter én række fra "sessions"-tabellen hvor id matcher
  const { data, error } = await sb
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  // Hvis der kom en fejl (fx ingen række fundet), returnerer vi 404 med fejlbesked
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  // Ellers returnerer vi selve session-rækken som JSON (default status 200)
  return NextResponse.json(data);
}

// PATCH /api/sessions/[id] – opdater én session
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Venter på at params bliver resolved og får id
  const { id } = await context.params;

  // Laver Supabase-klient baseret på requesten
  const sb = sbFromRequest(req);

  // Tjekker hvilken bruger der er logget ind ud fra auth-tokenet
  const { data: authRes } = await sb.auth.getUser();

  // Hvis der ikke er nogen bruger, svarer vi med 401 Unauthorized
  if (!authRes.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Læser JSON-body fra requesten (felterne der skal opdateres)
  const body = await req.json();

  // Opdaterer "sessions"-rækken med det givne id med de nye værdier fra body
  const { data, error } = await sb
    .from("sessions")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  // Hvis Supabase giver en fejl (fx valideringsfejl), svarer vi med 400 og fejlbesked
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Ellers sender vi den opdaterede række tilbage som JSON
  return NextResponse.json(data);
}

// DELETE /api/sessions/[id] – slet én session
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Henter id ud fra params-promise
  const { id } = await context.params;

  // Laver Supabase-klient
  const sb = sbFromRequest(req);

  // Henter den nuværende bruger ud fra auth-tokenet
  const { data: authRes } = await sb.auth.getUser();

  // Hvis der ikke er en bruger, må man ikke slette – send 401
  if (!authRes.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Beder Supabase om at slette rækken i "sessions" hvor id matcher
  const { error } = await sb.from("sessions").delete().eq("id", id);

  // Hvis der opstod en fejl ved sletning, returnér 400 + fejlbesked
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Ellers svarer vi med et simpelt "ok: true" JSON-objekt
  return NextResponse.json({ ok: true });
}
