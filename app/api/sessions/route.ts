// app/api/sessions/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/src/lib/supabaseServer"; // SSR client that reads auth cookies

export async function GET() {
  const sb = supabaseServer();

  const { data, error } = await sb
    .from("sessions")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  const sb = supabaseServer();

  // who’s calling? required for RLS + owner
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // minimal validation
  const required = ["title", "starts_at", "delivery_mode", "slug"];
  for (const k of required) {
    if (!body[k]) return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
  }

  // server-controlled payload (don’t trust client for owner)
  const payload = {
    title: body.title,
    description: body.description ?? null,
    starts_at: body.starts_at,            // UTC ISO string
    ends_at: body.ends_at ?? null,
    delivery_mode: body.delivery_mode,    // 'online' | 'in_person'
    meeting_url: body.meeting_url ?? null,
    location: body.location ?? null,
    slug: body.slug,
    is_published: body.is_published ?? false,
    owner: user.id,
  };

  const { data, error } = await sb.from("sessions").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ item: data }, { status: 201 });
}
