// Offentlig liste over kommende sessions
import { listPublicUpcoming } from "@/src/lib/queries";
import SessionCard from "@/src/components/SessionCard";
import type { Session } from "@/src/lib/types";

export default async function StudentListPage() {
  const sessions = await listPublicUpcoming();
  return (
    <div className="grid gap-3">
      {sessions.map((s: Session) => (
        <SessionCard
          key={s.id}
          href={`/(student)/[slug]?slug=${encodeURIComponent(s.slug ?? s.id)}`}
          title={s.title}
          starts_at={s.starts_at}
          delivery_mode={s.delivery_mode}
        />
      ))}
      {sessions.length === 0 && <p>Ingen kommende sessions endnu.</p>}
    </div>
  );
}