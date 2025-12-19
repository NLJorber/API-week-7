"use client";
import { useState } from "react";

export default function MedForm({ api, setMessage, loadMeds }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [amount, setAmount] = useState("");
  const [dosageUnit, setDosageUnit] = useState("");
  const [timeToTake, setTimeToTake] = useState("");
  const [frequency, setFrequency] = useState("");
  const [profileId, setProfileId] = useState("");
  const [notes, setNotes] = useState("");
  const [inventory, setInventory] = useState(0);

  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      name,
      dosage,
      amount: amount === "" ? undefined : Number(amount),
      dosageUnit: dosageUnit || undefined,
      timeToTake,
      frequency,
      notes,
      profileId: profileId || undefined,
      inventory: Number(inventory || 0)
    };
    try {
      if (id) {
        await api(`/api/meds/${id}`, { method: "PUT", body });
        setMessage("Medication updated", "success");
      } else {
        await api("/api/meds", { method: "POST", body });
        setMessage("Medication created", "success");
      }
      loadMeds();
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40 xl:col-span-2">
      <h2 className="text-lg font-semibold mb-2">Create / Update Med</h2>
      <form id="med-form" className="space-y-3" onSubmit={onSubmit}>
        <label className="text-sm text-slate-400 space-y-1">
          <span>Med ID (leave blank to create)</span>
          <input value={id} onChange={(e) => setId(e.target.value)} id="med-id" type="text" placeholder="Existing ID to update" className="w-full rounded-lg border border-slate-800 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
        </label>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm text-slate-400 space-y-1">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} id="med-name" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-600 focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>

          <label className="text-sm text-slate-500 space-y-1">
            <span>Dosage</span>
            <input value={dosage} onChange={(e) => setDosage(e.target.value)} id="med-dosage" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm text-slate-400 space-y-1">
            <span>Amount (number)</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} id="med-amount" type="number" step="0.01" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>

          <label className="text-sm text-slate-400 space-y-1">
            <span>Dosage Unit</span>
            <select value={dosageUnit} onChange={(e) => setDosageUnit(e.target.value)} id="med-dosage-unit" className="w-full rounded-lg border border-slate-800 bg-white text-slate-600 px-3 py-2 text-sm hover:border-brand-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
              <option value="">Select unit</option>
              <option value="mg">mg</option>
              <option value="ml">ml</option>
              <option value="pill">pill</option>
            </select>
          </label>
        </div>
        
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm text-slate-400 space-y-1">
            <span>Time To Take</span>
            <input value={timeToTake} onChange={(e) => setTimeToTake(e.target.value)} id="med-time" placeholder="08:00 AM" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>

          <label className="text-sm text-slate-400 space-y-1">
            <span>Frequency</span>
            <input value={frequency} onChange={(e) => setFrequency(e.target.value)} id="med-frequency" placeholder="Daily" required className="w-full rounded-lg border border-slate-300 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm text-slate-400 space-y-1">
            <span>Profile ID (optional)</span>
            <input value={profileId} onChange={(e) => setProfileId(e.target.value)} id="med-profile" placeholder="Profile ObjectId" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
          <label className="text-sm text-slate-400 space-y-1">
            <span>Notes</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} id="med-notes" placeholder="Optional notes" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
          <label className="text-sm text-slate-400 space-y-1">
            <span>Inventory</span>
            <input value={inventory} onChange={(e) => setInventory(e.target.value)} id="med-inventory" type="number" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
        </div>
        <button type="submit" className="rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:opacity-90">Save Med</button>
      </form>
    </section>
  );
}
