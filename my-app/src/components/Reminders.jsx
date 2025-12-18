"use client";
import { useState } from "react";

export default function Reminders({ reminders, api, setMessage, loadReminders }) {
  const [message, setMessageInput] = useState("");
  const [medId, setMedId] = useState("");
  const [due, setDue] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const dueAt = due ? new Date(due).toISOString() : null;
    const body = { message, medId: medId || undefined, dueAt };
    try {
      await api("/reminders", { method: "POST", body });
      setMessage("Reminder created", "success");
      loadReminders();
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }

  async function performAction(action, id) {
    try {
      if (action === "dismiss") await api(`/reminders/${id}/dismiss`, { method: "POST" });
      else if (action === "mark-due") await api(`/reminders/${id}/mark-due`, { method: "POST" });
      loadReminders();
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Reminders</h2>
        <button type="button" id="refresh-reminders" onClick={loadReminders} className="rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:border-brand-400">Refresh</button>
      </div>
      <form id="reminder-form" className="space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm text-slate-400 space-y-1">
            <span>Message</span>
            <input value={message} onChange={(e) => setMessageInput(e.target.value)} id="reminder-message" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
          <label className="text-sm text-slate-400 space-y-1">
            <span>Med ID (optional)</span>
            <input value={medId} onChange={(e) => setMedId(e.target.value)} id="reminder-med" placeholder="Link to medication" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
        </div>
        <label className="text-sm text-slate-400 space-y-1">
          <span>Due At</span>
          <input value={due} onChange={(e) => setDue(e.target.value)} id="reminder-due" type="datetime-local" required className="w-full rounded-lg border border-slate-800 bg-white text-slate-600 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
        </label>
        <button type="submit" className="rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:opacity-90">Create Reminder</button>
      </form>
      <div id="reminders-list" className="mt-3 space-y-2">
        {!reminders || reminders.length === 0 ? (
          <div className="text-sm text-slate-500">No reminders found</div>
        ) : (
          reminders.map((rem) => (
            <div key={rem._id} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{rem.message}</div>
                  <div className="text-xs text-slate-400">Due: {new Date(rem.dueAt).toLocaleString()}</div>
                </div>
                <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${rem.status === "due" ? "border-amber-400/50 text-amber-200" : "border-slate-700 text-slate-300"}`}>{rem.status}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">Med: {rem.medId || "n/a"}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => performAction("dismiss", rem._id)} className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90">Dismiss</button>
                <button onClick={() => performAction("mark-due", rem._id)} className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:border-brand-400">Mark Due</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
