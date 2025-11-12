// app/api/sessions/[id]/route.ts
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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const sb = sbFromRequest(req);
  const { data, error } = await sb.from("sessions").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const sb = sbFromRequest(req);
  const { data: authRes } = await sb.auth.getUser();
  if (!authRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await sb
    .from("sessions")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const sb = sbFromRequest(req);
  const { data: authRes } = await sb.auth.getUser();
  if (!authRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await sb.from("sessions").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
