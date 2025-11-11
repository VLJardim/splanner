// Dashboard-layout (her kunne man lave rolle-check senere)
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-4">
      <aside className="border rounded p-4">
        <div className="font-semibold mb-2">Lærer</div>
        <nav className="grid gap-2 text-sm">
          <a href="/(teacher)/dashboard">Mine sessions</a>
          <a href="/(teacher)/dashboard/new">Ny session</a>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
