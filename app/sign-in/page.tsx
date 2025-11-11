"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/src/components/AuthModal";

export default function SignInPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true); // åbner med det samme

  useEffect(() => {
    if (!open) router.push("/"); // luk → tilbage til forsiden
  }, [open, router]);

  return (
    <div className="p-6">
      {/* NOTE: prop hedder 'open' i den nye AuthModal */}
      <AuthModal open={open} onClose={() => setOpen(false)} />
      <p className="text-sm text-gray-600">
        Logger du ikke ind?{" "}
        <button className="underline" onClick={() => setOpen(false)}>Tilbage</button>
      </p>
    </div>
  );
}
