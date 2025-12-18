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
        await api(`/${id}`, { method: "DELETE" });
        setMessage("Deleted", "success");
      } else if (action === "skip") {
        await api(`/${id}/skip`, { method: "POST", body: { reason: "manual skip" } });
        setMessage("Marked skipped", "success");
      } else if (action === "taken") {
        await api(`/meds/${id}/taken`, { method: "POST" });
        setMessage("Marked taken", "success");
      } else if (action === "inventory") {
        const amount = Number(inventoryInputs[id]);
        if (Number.isNaN(amount)) return setMessage("Enter a number for inventory", "danger");
        await api(`/meds/${id}/inventory`, { method: "PATCH", body: { amount } });
        setMessage("Inventory updated", "success");
      }
      loadMeds();
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }

  if (!meds || meds.length === 0) return <div className="text-sm text-slate-500">No meds found</div>;

  return (
    <div>
      {meds.map((med) => (
        <div key={med._id} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-100">{med.name}</div>
              <div className="text-xs text-slate-400">{med.dosage} • {med.frequency} • {med.timeToTake}</div>
              {med.dosageAmount ? <div className="text-xs text-slate-500">Amount: {med.dosageAmount} {med.dosageUnit || ""}</div> : null}
              <div className="text-xs text-slate-500 mt-1">Taken: {med.takenCount ?? 0} | Skipped: {med.skippedCount ?? 0}</div>
              <div className="text-xs text-slate-500 mt-1">Last taken: {med.lastTakenAt ? new Date(med.lastTakenAt).toLocaleString() : "never"}</div>
            </div>
            <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs border-slate-700 text-slate-300">Qty: {med.quantity ?? 0}</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">{med.notes || ""}</div>
          <div className="text-xs text-slate-500 mt-1">Profile: {med.profileId || "n/a"}</div>
          <div className="text-xs text-slate-500 mt-1">Last skipped: {med.lastSkippedAt ? new Date(med.lastSkippedAt).toLocaleString() : "never"}</div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button onClick={() => performAction("taken", med._id)} className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90">Taken</button>
            <button onClick={() => performAction("skip", med._id)} className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90">Skip dose</button>
            <button onClick={() => performAction("delete", med._id)} className="rounded-lg border border-red-500/50 px-3 py-1.5 text-xs text-red-100 hover:bg-red-500/10">Delete</button>
            <div className="flex items-center gap-2">
              <input value={inventoryInputs[med._id] || ""} onChange={(e) => setInventory(med._id, e.target.value)} data-id={med._id} data-role="inventory-amount" className="w-24 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs" type="number" placeholder="+/- qty" />
              <button onClick={() => performAction("inventory", med._id)} className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:border-brand-400">Add</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
