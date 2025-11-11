// Læser-visning af en session
import { fromUTC } from "@/src/lib/time";
import type { Session } from "@/src/lib/types";
import ModeBadge from "./ModeBadge";

export default function SessionDetail({ s }: { s: Session }) {
  const start = fromUTC(s.starts_at).toLocaleString();
  return (
    <article className="max-w-2xl mx-auto space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{s.title}</h1>
        <ModeBadge mode={s.delivery_mode} />
      </header>

      {s.description && <p className="text-gray-700">{s.description}</p>}

      <div className="text-sm">
        <div><strong>Starter:</strong> {start}</div>
        {s.delivery_mode === "in_person" && s.location && (
          <div><strong>Sted:</strong> {s.location}</div>
        )}
        {s.delivery_mode === "online" && s.meeting_url && (
          <div className="truncate">
            <strong>Link:</strong>{" "}
            <a className="text-blue-600 underline" href={s.meeting_url}>
              {s.meeting_url}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
