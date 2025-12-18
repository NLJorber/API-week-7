import MainClient from "../components/MainClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-6">
      <header className="mb-4 space-y-1">
        <h1 className="text-2xl font-semibold">Medication Manager</h1>
        <h3 className="text-sm text-slate-400">Test the API with a tiny UI.</h3>
      </header>

      <main>
        {/* The interactive parts live in the client bundle */}
        <MainClient />

        <section>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40 mt-4 w-1/3">
            <div>
              <h1 className="text-white text-lg font-semibold p-2">Weekly view</h1>

              <div className="flex flex-wrap justify-center mb-12">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
                  <div key={d} className="flex group hover:bg-gradient-to-r from-cyan-300 to-sky-500 hover:shadow-lg rounded-lg mx-1 cursor-pointer justify-center w-16">
                    <div className="text-center px-4 py-4">
                      <p className="text-slate-400 group-hover:text-gray-100 text-sm transition-all group-hover:font-semibold duration-300">{d}</p>
                      <p className="text-slate-400 group-hover:text-gray-100 mt-3 group-hover:font-bold transition-all duration-300">{7 + i}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <div className="border border-slate-800 bg-slate-950 shadow-md rounded-lg py-6 px-4 w-full space-y-2">
                  <h2 className="text-lg font-semibold text-white mb-4">Events</h2>
                  <ul className="flex flex-wrap gap-4 w-full">
                    <li className="bg-slate-800 rounded-md p-3 text-gray-200 shadow-sm flex justify-between items-center w-full sm:w-[48%] lg:w-[30%]">
                      <span>10:00 AM —</span>
                      <div className="flex items-center space-x-2 rounded-lg border border-slate-600 px-4 py-2 hover:border-cyan-400">
                        <input type="checkbox" className="accent-cyan-400" />
                        <span className="text-sm text-slate-200">Taken</span>
                      </div>
                    </li>
                    <li className="bg-slate-800 rounded-md p-3 text-gray-200 shadow-sm flex justify-between items-center w-full sm:w-[48%] lg:w-[30%]">
                      <span>1:00 PM —</span>
                      <div className="flex items-center space-x-2 rounded-lg border border-slate-600 px-4 py-2 hover:border-cyan-400">
                        <input type="checkbox" className="accent-cyan-400" />
                        <span className="text-sm text-slate-200">Taken</span>
                      </div>
                    </li>
                    <li className="bg-slate-800 rounded-md p-3 text-gray-200 shadow-sm flex justify-between items-center w-full sm:w-[48%] lg:w-[30%]">
                      <span>7:00 PM —</span>
                      <div className="flex items-center space-x-2 rounded-lg border border-slate-600 px-4 py-2 hover:border-cyan-400">
                        <input type="checkbox" className="accent-cyan-400" />
                        <span className="text-sm text-slate-200">Taken</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
