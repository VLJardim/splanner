// Lille badge som viser online/physical
export default function ModeBadge({ mode }: { mode: "online" | "in_person" }) {
  const label = mode === "online" ? "Online" : "Fysisk";
  return (
    <span className="inline-block rounded-full px-2 py-0.5 text-xs border">
      {label}
    </span>
  );
}
