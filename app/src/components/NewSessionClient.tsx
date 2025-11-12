"use client";

import { useRouter } from "next/navigation";
import SessionForm from "@/src/components/SessionForm";
import { authFetch } from "@/src/lib/authFetch";

type Payload = {
  title: string;
  description: string;
  starts_at: string;              // UTC ISO
  delivery_mode: "online" | "in_person";
  meeting_url?: string | null;    // allow nulls (DB-friendly)
  location?: string | null;       // allow nulls (DB-friendly)
  slug: string;
};

export default function NewSessionClient() {
  const router = useRouter();

  async function onSubmit(payload: Payload) {
    // Ensure optional strings are either a real string or null
    const cleaned = {
      ...payload,
      meeting_url: payload.meeting_url?.trim() ? payload.meeting_url.trim() : null,
      location: payload.location?.trim() ? payload.location.trim() : null,
    };

    const res = await authFetch("/api/sessions", {
      method: "POST",
      body: JSON.stringify(cleaned),
    });

    let j: any = {};
    try { j = await res.json(); } catch {}

    if (!res.ok) {
      alert(j.error ?? "Kunne ikke oprette session");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-3">Ny session</h1>
      <SessionForm onSubmit={onSubmit} />
    </div>
  );
}
