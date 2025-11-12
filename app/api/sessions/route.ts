// app/api/sessions/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function sbFromRequest(req: Request) {
  const raw = req.headers.get("authorization") || "";
  const token = raw.replace(/^Bearer\s+/i, "");

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    }
  );
}

// GET /api/sessions
export async function GET(req: Request) {
  const sb = sbFromRequest(req);

  const { data, error } = await sb
    .from("sessions")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data });
}

// POST /api/sessions
export async function POST(req: Request) {
  const sb = sbFromRequest(req);

  // Require auth
  const { data: authRes } = await sb.auth.getUser();
  if (!authRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // TODO: validate body shape here

  // Ensure user_id on insert (either pass it from client or set here)
  const payload = Array.isArray(body) ? body : [body];
  payload.forEach((p) => (p.user_id ??= authRes.user!.id));

  const { data, error } = await sb
    .from("sessions")
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
