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

// ✅ GET: list sessions (optional)
export async function GET(req: Request) {
  const sb = sbFromRequest(req);
  const { data, error } = await sb
    .from("sessions")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data });
}

// ✅ POST: create new session
export async function POST(req: Request) {
  const sb = sbFromRequest(req);
  const { data: authRes } = await sb.auth.getUser();
  if (!authRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload = { ...body, user_id: authRes.user.id }; // 👈 add user_id

  const { data, error } = await sb.from("sessions").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data, { status: 201 });
}
