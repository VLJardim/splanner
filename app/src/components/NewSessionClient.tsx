"use client";

import { useRouter } from "next/navigation";
import SessionForm from "@/src/components/SessionForm";

type Payload = {
  title: string;
  description: string;
  starts_at: string;              // UTC ISO
  delivery_mode: "online" | "in_person";
  meeting_url?: string;
  location?: string;
  slug: string;
};

export default function NewSessionClient() {
  const router = useRouter();

  async function onSubmit(payload: Payload) {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
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
