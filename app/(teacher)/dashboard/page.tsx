// Mine sessions (dummy – udskift med listMine når auth er på plads)
export default async function DashboardHome() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Mine sessions</h1>
      <p>Tilføj auth og brug listMine(user.id) her.</p>
    </div>
  );
}
