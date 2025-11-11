// Simpel landing – kan senere redirecte baseret på rolle
import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-gray-100 bg-cover bg-center min-h-screen flex items-center justify-center">
      <div className="space-y-3 text-center bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold">Velkommen til Session Planner</h1>
        <p>Log ind for at fortsætte.</p>
        <div className="flex gap-2 text-center justify-center">
          <Link className="underline" href="/sign-in">Log ind</Link>
          <Link className="underline" href="/(student)/page">Se sessions</Link>
        </div>
      </div>
    </div>
  );
}
