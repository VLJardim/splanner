// Dynamisk detalje-side
import { getBySlug } from "@/src/lib/queries";
import SessionDetail from "@/src/components/SessionDetail";
import { notFound } from "next/navigation";

export default async function SessionSlugPage({ params }: { params: { slug: string } }) {
  const session = await getBySlug(params.slug);
  if (!session) return notFound();
  return <SessionDetail s={session} />;
}
