"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";

export default function HeaderAuth() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="px-3 py-1.5 rounded border" onClick={()=>setOpen(true)}>
        Log ind
      </button>
      <AuthModal open={open} onClose={()=>setOpen(false)} />
    </>
  );
}
