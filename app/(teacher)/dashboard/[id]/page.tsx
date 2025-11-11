// Rediger-side (MVP placeholder)
export default function EditSessionPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-xl font-semibold">Rediger session {params.id}</h1>
      <p>Hent data og forfyld SessionForm her.</p>
    </div>
  );
}
