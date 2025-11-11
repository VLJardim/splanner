// Minimal API for opdater/slet
import { NextResponse } from "next/server";

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  // TODO: opdater i Supabase
  return NextResponse.json({ ok: true, id: params.id });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  // TODO: slet/soft-delete i Supabase
  return NextResponse.json({ ok: true, id: params.id });
}
