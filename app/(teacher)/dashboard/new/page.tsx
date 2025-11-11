import SessionForm from "@/src/components/SessionForm";

export default function NewSessionPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-3">Ny session</h1>
      <SessionForm
        onSubmit={async (payload) => {
          // TODO: Kald /api/sessions (POST) eller direkte Supabase insert
          console.log("create", payload);
        }}
      />
    </div>
  );
}
