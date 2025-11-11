// Kort til lister (forside / dashboard)
import Link from "next/link";
import ModeBadge from "./ModeBadge";
import { fromUTC } from "@/src/lib/time";

type Props = {
  href: string;
  title: string;
  starts_at: string; // UTC
  delivery_mode: "online" | "in_person";
};

export default function SessionCard({ href, title, starts_at, delivery_mode }: Props) {
  const d = fromUTC(starts_at);
  const when = d.toLocaleString();
  return (
    <Link href={href} className="block border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <ModeBadge mode={delivery_mode} />
      </div>
      <p className="text-sm text-gray-600 mt-1">{when}</p>
    </Link>
  );
}
