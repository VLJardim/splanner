// app/src/components/AuthModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signUp } from "@/src/lib/auth";

type Props = { open: boolean; onClose: () => void };

export default function AuthModal({ open, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const didSubmitRef = useRef(false);

  useEffect(() => {
    if (didSubmitRef.current) {
      onClose();
      didSubmitRef.current = false;
    }
  }, [pathname, onClose]);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setErr(null);
    if (!email || !email.trim() || !pw) {
      setErr("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = mode === "login" ? await signIn(email, pw) : await signUp(email, pw);

      if (!res || typeof res !== "object") {
        setErr("Unexpected response. Please try again.");
        return;
      }

      const role = (res as any).role as string | undefined;
      if (role !== "teacher" && role !== "student") {
        setErr("Unable to determine user role after sign in.");
        return;
      }

      didSubmitRef.current = true;
      const dest = role === "teacher" ? "/dashboard" : "/student-home";

      if (pathname === dest) {
        onClose();
        didSubmitRef.current = false;
      } else {
        router.replace(dest);
        setTimeout(() => {
          if (didSubmitRef.current) {
            onClose();
            didSubmitRef.current = false;
          }
        }, 500);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setErr(message || "Login failed");
      didSubmitRef.current = false;
    } finally {
      setLoading(false);
    }
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
