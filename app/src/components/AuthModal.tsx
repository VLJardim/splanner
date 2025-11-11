"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";

type Props = { open: boolean; onClose: () => void };

export default function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function redirectByRole() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    onClose();
    if (profile?.role === "teacher") window.location.href = "/(teacher)/dashboard";
    else window.location.href = "/(student)/page";
  }

  async function submit() {
    setErr(null);
    setLoading(true);
    const auth = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password: pw })
      : await supabase.auth.signUp({ email, password: pw });
    setLoading(false);
    if (auth.error) { setErr(auth.error.message); return; }
    await redirectByRole();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {mode === "login" ? "Log ind" : "Opret konto"}
          </h2>
          <button onClick={onClose} className="text-sm">Luk</button>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setMode("login")}
              className={`px-2 py-1 rounded border ${mode==="login" ? "bg-gray-100" : ""}`}
            >Log ind</button>
            <button
              onClick={() => setMode("signup")}
              className={`px-2 py-1 rounded border ${mode==="signup" ? "bg-gray-100" : ""}`}
            >Opret</button>
          </div>

          <label className="text-sm">
            Email
            <input
              className="mt-1 w-full rounded border p-2"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@ek.dk"
              required
            />
          </label>

          <label className="text-sm">
            Adgangskode
            <input
              type="password"
              className="mt-1 w-full rounded border p-2"
              value={pw}
              onChange={(e)=>setPw(e.target.value)}
              required
            />
          </label>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="rounded bg-black px-3 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Arbejder…" : (mode === "login" ? "Log ind" : "Opret konto")}
          </button>
        </div>
      </div>
    </div>
  );
}
