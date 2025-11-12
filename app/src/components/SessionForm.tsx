"use client";

import { useState } from "react";
import { makeSlug } from "@/src/lib/slug";
import { toUTCISO } from "@/src/lib/time";

type Props = {
  onSubmit: (payload: {
    title: string;
    description: string;
    starts_at: string; // UTC
    delivery_mode: "online" | "in_person";
    meeting_url?: string | null;
    location?: string | null;
    slug: string;
  }) => Promise<void>;
};

export default function SessionForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [startsLocal, setStartsLocal] = useState(""); // datetime-local
  const [mode, setMode] = useState<"online" | "in_person">("online");
  const [meetingUrl, setUrl] = useState("");
  const [location, setLocation] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Guard: datetime-local empty → block
    if (!startsLocal) return;

    const slug = makeSlug(title);
    const starts_at = toUTCISO(new Date(startsLocal)); // your helper already normalizes

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      starts_at,
      delivery_mode: mode,
      meeting_url: mode === "online" ? (meetingUrl.trim() || null) : undefined,
      location: mode === "in_person" ? (location.trim() || null) : undefined,
      slug,
    });
  }

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const slug = makeSlug(title);
        const starts_at = toUTCISO(new Date(startsLocal));
        await onSubmit({
          title,
          description,
          starts_at,
          delivery_mode: mode,
          meeting_url: mode === "online" ? meetingUrl : undefined,
          location: mode === "in_person" ? location : undefined,
          slug,
        });
      }}
    >
      <label className="block">
        <span className="text-sm">Titel</span>
        <input className="w-full border p-2 rounded" value={title} onChange={(e)=>setTitle(e.target.value)} required />
      </label>

      <label className="block">
        <span className="text-sm">Beskrivelse</span>
        <textarea className="w-full border p-2 rounded" value={description} onChange={(e)=>setDesc(e.target.value)} />
      </label>

      <label className="block">
        <span className="text-sm">Start (lokal tid)</span>
        <input type="datetime-local" className="w-full border p-2 rounded"
               value={startsLocal} onChange={(e)=>setStartsLocal(e.target.value)} required />
      </label>

      <div className="flex gap-4">
        <label className="flex items-center gap-1">
          <input type="radio" checked={mode==="online"} onChange={()=>setMode("online")} />
          Online
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" checked={mode==="in_person"} onChange={()=>setMode("in_person")} />
          Fysisk
        </label>
      </div>

      {mode === "online" && (
        <label className="block">
          <span className="text-sm">Møde-link</span>
          <input className="w-full border p-2 rounded" value={meetingUrl} onChange={(e)=>setUrl(e.target.value)} />
        </label>
      )}

      {mode === "in_person" && (
        <label className="block">
          <span className="text-sm">Lokation</span>
          <input className="w-full border p-2 rounded" value={location} onChange={(e)=>setLocation(e.target.value)} />
        </label>
      )}

      <button className="px-4 py-2 rounded bg-black text-white">Gem</button>
    </form>
  );
}
