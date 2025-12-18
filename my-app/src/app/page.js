import MainClient from "../components/MainClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-6">
      <header className="mb-4 space-y-1">
        <h1 className="text-2xl font-semibold">Medication Manager</h1>
        <h3 className="text-sm text-slate-400">Test the API with a tiny UI. Use /auth/login first.</h3>
        <div id="auth-status" className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm">Not authenticated</div>
      </header>

      <main>
        <MainClient />
      </main>
    </div>
  );
}
