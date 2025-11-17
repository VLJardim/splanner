"use client";

import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import { supabase } from "@/src/lib/supabaseClient";
import LogOut from "./LogOut";

export default function HeaderAuth() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  if (user) {
    return <LogOut />;
  }
  
      return (
    <>
      <button className="px-3 py-1.5 rounded border" onClick={()=>setOpen(true)}>
        Log ind
      </button>
      <AuthModal open={open} onClose={()=>setOpen(false)} />
    </>
  );
}
