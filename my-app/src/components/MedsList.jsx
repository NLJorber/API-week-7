"use client";
import { useState } from "react";

export default function MedsList({ meds, api, setMessage, loadMeds }) {
  const [inventoryInputs, setInventoryInputs] = useState({});

  function setInventory(id, val) {
    setInventoryInputs((s) => ({ ...s, [id]: val }));
  }

  async function performAction(action, id) {
    try {
      if (action === "delete") {
        await api(`/api/meds/${id}`, { method: "DELETE" });
        setMessage("Deleted", "success");
      } else if (action === "skip") {
        await api(`/api/meds/${id}/skip`, { method: "POST", body: { reason: "manual skip" } });
        setMessage("Marked skipped", "success");
      } else if (action === "taken") {
        await api(`/api/meds/${id}/taken`, { method: "POST" });
        setMessage("Marked taken", "success");
      } else if (action === "inventory") {
        const amount = Number(inventoryInputs[id]);
        if (Number.isNaN(amount)) return setMessage("Enter a number for inventory", "danger");
        await api(`/api/meds/${id}/inventory`, { method: "PATCH", body: { amount } });
        setMessage("Inventory updated", "success");
      }
      loadMeds();
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }

  if (!meds || meds.length === 0) return <div className="text-sm text-slate-200/80">No meds found</div>;

  return (
    <>
      {meds.map((med) => (
        <div key={med._id} className="rounded-xl border border-white/30 bg-white/80 px-3 py-3 text-slate-800 shadow-md shadow-black/10 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900">{med.name}</div>
              <div className="text-xs text-slate-600">{med.dosage} • {med.frequency} • {med.timeToTake}</div>
              {med.amount ? <div className="text-xs text-slate-600">Amount: {med.amount} {med.dosageUnit || ""}</div> : null}
              <div className="text-xs text-slate-600 mt-1">Taken: {med.takenCount ?? 0} | Skipped: {med.skippedCount ?? 0}</div>
              <div className="text-xs text-slate-600 mt-1">Last taken: {med.lastTakenAt ? new Date(med.lastTakenAt).toLocaleString() : "never"}</div>
            </div>
            <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs border-slate-400 text-slate-700">Qty: {med.inventory ?? 0}</span>
          </div>
          <div className="text-xs text-slate-600 mt-2">{med.notes || ""}</div>
          <div className="text-xs text-slate-600 mt-1">Profile: {med.profileId || "n/a"}</div>
          <div className="text-xs text-slate-600 mt-1">Last skipped: {med.lastSkippedAt ? new Date(med.lastSkippedAt).toLocaleString() : "never"}</div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button onClick={() => performAction("taken", med._id)} className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90">
              Taken
            </button>
            <button onClick={() => performAction("skip", med._id)} className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90">
              Skip dose
            </button>
            <button onClick={() => performAction("delete", med._id)} className="rounded-lg border border-pink-500/60 px-3 py-1.5 text-xs text-pink-600 hover:bg-pink-500/10">
              Delete
            </button>
            <div className="flex items-center gap-2">
              <input
                value={inventoryInputs[med._id] || ""}
                onChange={(e) => setInventory(med._id, e.target.value)}
                data-id={med._id}
                data-role="inventory-amount"
                className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                type="number"
                placeholder="+/- qty"
              />
              <button
                onClick={() => performAction("inventory", med._id)}
                className="rounded-lg border border-slate-400 px-3 py-1.5 text-xs text-slate-600 hover:border-brand-400"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
