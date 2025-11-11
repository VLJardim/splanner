"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/src/components/AuthModal";
import { signIn } from "@/src/lib/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [open, setOpen] = useState(true); // åbner med det samme

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  }

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
