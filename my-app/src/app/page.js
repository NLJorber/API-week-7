import MainClient from "../components/MainClient";
import Sparkles from "../components/Sparkles";

export default function Home() {
  return (
    <div className="relative min-h-screen text-slate-800 overflow-hidden">
      <Sparkles />
      <div className="relative z-10 px-6 py-10 max-w-6xl mx-auto">
        <header className="mb-6 flex justify-center">
          <div className="bg-gradient-to-br from-[#b064f7]/90 to-[#8845e6]/90 backdrop-blur rounded-2xl px-10 py-6 text-center shadow-2xl shadow-purple-900/40 border border-white/10 max-w-2xl w-full">
            <h1 className="text-3xl font-extrabold font-[Poppins] text-white">Medication Manager</h1>
            <h3 className="text-sm text-white/90 mt-1">Test the API with a tiny UI.</h3>
          </div>
        </header>

        <main>
          <MainClient />
        </main>
      </div>
    </div>
  );
}
