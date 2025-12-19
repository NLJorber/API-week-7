"use client";
import { useState } from "react";

export default function Reminders({ reminders, api, setMessage, loadReminders }) {
  const [message, setMessageField] = useState("");
  const [medId, setMedId] = useState("");
  const [dueAt, setDueAt] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const dueRaw = dueAt ? new Date(dueAt).toISOString() : null;
    const body = { message, medId: medId || undefined, dueAt: dueRaw };
    try {
      await api("/api/reminders", { method: "POST", body });
      setMessage("Reminder created", "success");
      setMessageField("");
      setMedId("");
      setDueAt("");
      loadReminders();
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }

  return (
    <section className="rounded-xl bg-gradient-to-br from-[#f7f2e9]/95 to-[#e9e0d6]/95 p-4 shadow-xl shadow-black/20 border border-slate-200 text-slate-800">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Reminders</h2>
        <button
          type="button"
          onClick={loadReminders}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-400"
          id="refresh-reminders"
        >
          Refresh
        </button>
      </div>
      <form id="reminder-form" className="space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm text-slate-800 space-y-1">
            <span className="text-slate-900">Message</span>
            <input
              value={message}
              onChange={(e) => setMessageField(e.target.value)}
              required
              id="reminder-message"
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-700 placeholder-slate-500 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
            />
          </label>
          <label className="text-sm text-slate-800 space-y-1">
            <span className="text-slate-900">Med ID (optional)</span>
            <input
              value={medId}
              onChange={(e) => setMedId(e.target.value)}
              id="reminder-med"
              placeholder="Link to medication"
            className="w-full rounded-lg border border-slate-300 bg-white text-slate-700 placeholder-slate-500 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
            />
          </label>
        </div>
        <label className="text-sm text-slate-800 space-y-1">
          <span className="text-slate-900">Due At</span>
          <input
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            id="reminder-due"
            type="datetime-local"
            required
            className="w-full rounded-lg border border-slate-300 bg-white text-slate-700 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
        >
          Create Reminder
        </button>
      </form>

      <div id="reminders-list" className="mt-3 space-y-2">
        {!reminders || reminders.length === 0 ? (
          <div className="text-sm text-slate-200/80">No reminders found</div>
        ) : (
          reminders.map((rem) => {
            const due = rem.status === "due";
            return (
              <div key={rem._id} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{rem.message}</div>
                    <div className="text-xs text-slate-600">Due: {new Date(rem.dueAt).toLocaleString()}</div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${
                      due ? "border-amber-400/50 text-amber-700" : "border-slate-400 text-slate-600"
                    }`}
                  >
                    {rem.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-2">Med: {rem.medId || "n/a"}</div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => handleReminder("dismiss", rem._id)}
                    className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleReminder("mark-due", rem._id)}
                    className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:border-brand-400"
                  >
                    Mark Due
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );

  async function handleReminder(action, id) {
    try {
      if (action === "dismiss") {
        await api(`/api/reminders/${id}/dismiss`, { method: "POST" });
      } else if (action === "mark-due") {
        await api(`/api/reminders/${id}/mark-due`, { method: "POST" });
      }
      loadReminders();
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }
}
