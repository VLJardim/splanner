"use client";

/*  Denne side er en klient-komponent, så vi kan kalde authFetch (JWT i header)
    og vise data direkte. Ingen nye filer nødvendig. */

import "../../globals.css";
import { useEffect, useState } from "react";
import { authFetch } from "@/src/lib/authFetch";
import SessionCard from "@/src/components/SessionCard";
import LogOut from "@/src/components/LogOut";

type SessionRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;                   // skal matche din DB-kolonne
  delivery_mode: "online" | "in_person";
  meeting_url?: string | null;
  location?: string | null;
  slug?: string | null;
};

export default function DashboardHome() {
  const [items, setItems] = useState<SessionRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [scope, setScope] = useState<"all" | "mine">("all"); // lille toggle i UI

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // GET returnerer alle; hvis du vil “mine”, brug ?scope=mine og tilpas din API GET
        const res = await authFetch(`/api/sessions${scope === "mine" ? "?scope=mine" : ""}`);
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Kunne ikke hente sessions");
        if (alive) setItems(j.items ?? []);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Fejl ved hentning");
      }
    })();
    return () => { alive = false; };
  }, [scope]);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sessions</h1>

        {/* Lille filter i toppen */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Vis:</label>
          <select
            className="border rounded p-2 text-sm"
            value={scope}
            onChange={(e) => setScope(e.target.value as "all" | "mine")}
          >
            <option value="all">Alle</option>
            <option value="mine">Mine</option>
          </select>
        </div>

        {/* Lærer-knap til at oprette nyt (studenter ser bare data) */}
        {/* <Link href="/dashboard/new" className="px-3 py-2 rounded bg-black text-white">Ny session</Link> */}
      </header>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {!items && !err && <p>Henter…</p>}
      {items && items.length === 0 && <p>Ingen sessions fundet.</p>}

      {items && items.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
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
