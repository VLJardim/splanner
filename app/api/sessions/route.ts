// Minimal API – skabelon (udbyg med Supabase insert/list)
import { NextResponse } from "next/server";

export async function GET() {
  // TODO: returner liste fra Supabase
  return NextResponse.json({ items: [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  // TODO: indsæt i Supabase (valider body først)
  return NextResponse.json({ ok: true, received: body }, { status: 201 });
}
