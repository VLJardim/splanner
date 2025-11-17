// app/(student)/student-home/page.tsx
"use client";

/*  Samme stil som /dashboard:
    - Klient-komponent
    - Bruger authFetch til at kalde /api/sessions
    - Viser cards med sessions
*/

import "../../globals.css";
import { useEffect, useState } from "react";
import { authFetch } from "@/src/lib/authFetch";
import SessionCard from "@/src/components/SessionCard";

type SessionRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  delivery_mode: "online" | "in_person";
  meeting_url?: string | null;
  location?: string | null;
  slug?: string | null;
};

export default function StudentHomePage() {
  const [items, setItems] = useState<SessionRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // Her kan du filtrere på "public" sessions via query string
        const res = await authFetch("/api/sessions?scope=public");
        const j = await res.json();

        if (!res.ok) {
          throw new Error(j.error || "Kunne ikke hente sessions");
        }

        if (alive) {
          setItems(j.items ?? []);
        }
      } catch (e: any) {
        if (alive) {
          setErr(e?.message || "Fejl ved hentning");
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Kommende sessions</h1>
      </header>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {!items && !err && <p>Henter…</p>}
      {items && items.length === 0 && <p>Ingen kommende sessions endnu.</p>}

      {items && items.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <SessionCard
              key={s.id}
              // Juster denne til dit rigtige student-route-pattern
              href={s.slug ? `/student-home/${s.slug}` : "#"}
              title={s.title}
              starts_at={s.starts_at}
              delivery_mode={s.delivery_mode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
