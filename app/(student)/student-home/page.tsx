"use client";

/* STUDENT HOME – læser alle sessions (read-only) og viser dem med SessionCard */
import "../../globals.css";
import { useEffect, useState } from "react";
import { authFetch } from "@/src/lib/authFetch";
import SessionCard from "@/src/components/SessionCard";

type SessionRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;                   // timestamptz fra DB
  delivery_mode: "online" | "in_person";
  meeting_url?: string | null;
  location?: string | null;
  slug?: string | null;
};

export default function StudentHome() {
  const [items, setItems] = useState<SessionRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "online" | "in_person">("all");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Studerende må læse alt (RLS select using (true)), så vi henter “all”
        const res = await authFetch("/api/sessions?scope=all");
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Kunne ikke hente sessions");
        if (alive) setItems(j.items ?? []);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Fejl ved hentning");
      }
    })();
    return () => { alive = false; };
  }, []);

  // Simpel klientfilter til UX
  const filtered = (items ?? []).filter(s => {
    const q = search.trim().toLowerCase();
    const matchesText = !q || s.title.toLowerCase().includes(q) || (s.description ?? "").toLowerCase().includes(q);
    const matchesMode = modeFilter === "all" || s.delivery_mode === modeFilter;
    return matchesText && matchesMode;
  });

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tilgængelige sessions</h1>
        <div className="flex gap-2">
          <input
            className="border rounded p-2 text-sm"
            placeholder="Søg…"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
          <select
            className="border rounded p-2 text-sm"
            value={modeFilter}
            onChange={(e)=>setModeFilter(e.target.value as any)}
          >
            <option value="all">Alle</option>
            <option value="online">Online</option>
            <option value="in_person">Fysisk</option>
          </select>
        </div>
      </header>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {!items && !err && <p>Henter…</p>}
      {items && filtered.length === 0 && <p>Ingen sessions matcher din søgning.</p>}

      {filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SessionCard
              key={s.id}
              href={s.slug ? `/sessions/${s.slug}` : "#"}
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