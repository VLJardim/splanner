// Simpel landing – kan senere redirecte baseret på rolle
import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Velkommen</h1>
      <p>Log ind for at fortsætte.</p>
      <div className="flex gap-2">
        <Link className="underline" href="/sign-in">Log ind</Link>
        <Link className="underline" href="/(student)/page">Se sessions</Link>
      </div>
    </div>
  );
}
