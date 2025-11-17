"use client";

import { signOut } from "@/src/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogOut() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogOut = async () => {
        setLoading(true);
        try {
            await signOut();
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
  <button onClick={handleLogOut} disabled={loading}>
    {loading ? "Logger ud..." : "Log ud"}
  </button>
);

    }