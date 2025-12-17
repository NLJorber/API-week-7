"use client";

import { useEffect, useMemo, useState } from "react";

const API_PREFIX = "/api";

export default function LegacyApp() {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState([]);
  const [meds, setMeds] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [inventoryAmounts, setInventoryAmounts] = useState({});

  const authed = Boolean(token);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadMeds();
      loadReminders();
    }
  }, [token]);

  function setMessage(text, type = "") {
    const id = Date.now() + Math.random();
    setMessages((prev) => [{ id, text, type }, ...prev]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 6000);
  }

  async function api(path, { method = "GET", body, headers = {} } = {}) {
    const opts = { method, headers: { ...headers } };
    if (body !== undefined) {
      opts.body = typeof body === "string" ? body : JSON.stringify(body);
      opts.headers["Content-Type"] = "application/json";
    }
    if (token) {
      opts.headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_PREFIX}${path}`, opts);
    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { raw: text };
      }
    }
    if (!res.ok) {
      throw new Error(data.message || res.statusText);
    }
    return data;
  }

  async function loadMeds() {
    try {
      const medsList = await api("/meds");
      setMeds(Array.isArray(medsList) ? medsList : []);
    } catch (error) {
      setMessage(error.message, "danger");
    }
  }

  async function loadReminders() {
    try {
      const reminderList = await api("/reminders");
      setReminders(Array.isArray(reminderList) ? reminderList : []);
    } catch (error) {
      setMessage(error.message, "danger");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setMessage("Logged in", "success");
      form.reset();
    } catch (error) {
      setMessage(error.message, "danger");
    }
  }

  async function handleSignup() {
    const email = String(document.getElementById("login-email")?.value || "").trim();
    const password =
      String(document.getElementById("login-password")?.value || "").trim() || "password123";
    const name = email.split("@")[0] || "User";

    try {
      await api("/auth/signup", { method: "POST", body: { email, password, name } });
      setMessage("Signup success, now log in.", "success");
    } catch (error) {
      setMessage(error.message, "danger");
    }
  }

  function handleLogout() {
    setToken("");
    localStorage.removeItem("token");
    setMeds([]);
    setReminders([]);
    setMessage("Logged out");
  }

  async function handleMedSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const id = String(formData.get("medId") || "").trim();

    const body = {
      name: formData.get("name"),
      dosage: formData.get("dosage"),
      dosageAmount: formData.get("dosageAmount") === "" ? undefined : Number(formData.get("dosageAmount")),
      dosageUnit: formData.get("dosageUnit") || undefined,
      timeToTake: formData.get("timeToTake"),
      frequency: formData.get("frequency"),
      notes: formData.get("notes"),
      profileId: formData.get("profileId") || undefined,
      quantity: Number(formData.get("quantity") || 0)
    };

    try {
      if (id) {
        await api(`/meds/${id}`, { method: "PUT", body });
        setMessage("Medication updated", "success");
      } else {
        await api("/meds", { method: "POST", body });
        setMessage("Medication created", "success");
      }
      form.reset();
      loadMeds();
    } catch (error) {
      setMessage(error.message, "danger");
    }
  }

  async function handleMedAction(id, action) {
    try {
      if (action === "delete") {
        await api(`/meds/${id}`, { method: "DELETE" });
        setMessage("Deleted", "success");
      } else if (action === "skip") {
        await api(`/meds/${id}/skip`, { method: "POST", body: { reason: "manual skip" } });
        setMessage("Marked skipped", "success");
      } else if (action === "inventory") {
        const amount = Number(inventoryAmounts[id]);
        if (Number.isNaN(amount)) {
          setMessage("Enter a number for inventory", "danger");
          return;
        }
        await api(`/meds/${id}/inventory`, { method: "PATCH", body: { amount } });
        setMessage("Inventory updated", "success");
        setInventoryAmounts((prev) => ({ ...prev, [id]: "" }));
      } else if (action === "taken") {
        await api(`/meds/${id}/taken`, { method: "POST" });
        setMessage("Marked taken", "success");
      }
      loadMeds();
    } catch (error) {
      setMessage(error.message, "danger");
    }
  }

  async function handleReminderSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const dueRaw = formData.get("dueAt");
    const dueAt = dueRaw ? new Date(dueRaw).toISOString() : null;

    const body = {
      message: formData.get("message"),
      medId: formData.get("medId") || undefined,
      dueAt
    };

    try {
      await api("/reminders", { method: "POST", body });
      setMessage("Reminder created", "success");
      form.reset();
      loadReminders();
    } catch (error) {
      setMessage(error.message, "danger");
    }
  }

  async function handleReminderAction(id, action) {
    try {
      if (action === "dismiss") {
        await api(`/reminders/${id}/dismiss`, { method: "POST" });
      } else if (action === "mark-due") {
        await api(`/reminders/${id}/mark-due`, { method: "POST" });
      }
      loadReminders();
    } catch (error) {
      setMessage(error.message, "danger");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-6">
      <header className="mb-4 space-y-1">
        <h1 className="text-2xl font-semibold">Medication Manager</h1>
        <h3 className="text-sm text-slate-400">Test the API with a tiny UI. Use /auth/login first.</h3>
        <div
          className={`rounded-lg border px-3 py-2 text-sm ${authed
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
            : "border-slate-800 bg-slate-900 text-slate-200"}`}
        >
          {authed ? "Authenticated" : "Not authenticated"}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40">
          <h2 className="text-lg font-semibold mb-2">Auth</h2>
          <form id="login-form" className="space-y-3" onSubmit={handleLogin}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm text-slate-400 space-y-1">
                <span>Email</span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                />
              </label>
              <label className="text-sm text-slate-400 space-y-1">
                <span>Password</span>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="password"
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:opacity-90">Login</button>
              <button type="button" className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-200 hover:border-brand-400" onClick={handleSignup}>Quick Sign Up</button>
              <button type="button" className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-200 hover:border-brand-400" onClick={handleLogout}>Logout</button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40 xl:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Create / Update Med</h2>
          <form id="med-form" className="space-y-3" onSubmit={handleMedSubmit}>
            <label className="text-sm text-slate-400 space-y-1">
              <span>Med ID (leave blank to create)</span>
              <input
                id="med-id"
                name="medId"
                type="text"
                placeholder="Existing ID to update"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
              />
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="text-sm text-slate-400 space-y-1">
                <span>Name</span>
                <input id="med-name" name="name" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
              <label className="text-sm text-slate-400 space-y-1">
                <span>Dosage</span>
                <input id="med-dosage" name="dosage" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="text-sm text-slate-400 space-y-1">
                <span>Dosage Amount (number)</span>
                <input id="med-dosage-amount" name="dosageAmount" type="number" step="0.01" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
              <label className="text-sm text-slate-400 space-y-1">
                <span>Dosage Unit</span>
                <select id="med-dosage-unit" name="dosageUnit" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400">
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
                <input id="med-time" name="timeToTake" placeholder="08:00 AM" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
              <label className="text-sm text-slate-400 space-y-1">
                <span>Frequency</span>
                <input id="med-frequency" name="frequency" placeholder="Daily" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="text-sm text-slate-400 space-y-1">
                <span>Profile ID (optional)</span>
                <input id="med-profile" name="profileId" placeholder="Profile ObjectId" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
              <label className="text-sm text-slate-400 space-y-1">
                <span>Notes</span>
                <input id="med-notes" name="notes" placeholder="Optional notes" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
              <label className="text-sm text-slate-400 space-y-1">
                <span>Quantity</span>
                <input id="med-quantity" name="quantity" type="number" defaultValue={0} className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
            </div>
            <button type="submit" className="rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:opacity-90">Save Med</button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Reminders</h2>
            <button type="button" className="rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:border-brand-400" onClick={loadReminders}>Refresh</button>
          </div>
          <form id="reminder-form" className="space-y-3" onSubmit={handleReminderSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm text-slate-400 space-y-1">
                <span>Message</span>
                <input id="reminder-message" name="message" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
              <label className="text-sm text-slate-400 space-y-1">
                <span>Med ID (optional)</span>
                <input id="reminder-med" name="medId" placeholder="Link to medication" className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
              </label>
            </div>
            <label className="text-sm text-slate-400 space-y-1">
              <span>Due At</span>
              <input id="reminder-due" name="dueAt" type="datetime-local" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
            </label>
            <button type="submit" className="rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:opacity-90">Create Reminder</button>
          </form>
          <div id="reminders-list" className="mt-3 space-y-2">
            {reminders.length === 0 ? (
              <div className="text-sm text-slate-500">No reminders found</div>
            ) : (
              reminders.map((rem) => {
                const due = rem.status === "due";
                return (
                  <div key={rem._id} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-100">{rem.message}</div>
                        <div className="text-xs text-slate-400">Due: {new Date(rem.dueAt).toLocaleString()}</div>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${due ? "border-amber-400/50 text-amber-200" : "border-slate-700 text-slate-300"}`}>
                        {rem.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">Med: {rem.medId || "n/a"}</div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button type="button" className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90" onClick={() => handleReminderAction(rem._id, "dismiss")}>Dismiss</button>
                      <button type="button" className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:border-brand-400" onClick={() => handleReminderAction(rem._id, "mark-due")}>Mark Due</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-semibold">Medications</h2>
          <button type="button" className="rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:border-brand-400" onClick={loadMeds}>Load Meds</button>
        </div>
        <div id="meds-list" className="space-y-2">
          {meds.length === 0 ? (
            <div className="text-sm text-slate-500">No meds found</div>
          ) : (
            meds.map((med) => (
              <div key={med._id} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-100">{med.name}</div>
                    <div className="text-xs text-slate-400">{med.dosage} • {med.frequency} • {med.timeToTake}</div>
                    {med.dosageAmount ? (
                      <div className="text-xs text-slate-500">Amount: {med.dosageAmount} {med.dosageUnit || ""}</div>
                    ) : null}
                    <div className="text-xs text-slate-500 mt-1">Taken: {med.takenCount ?? 0} | Skipped: {med.skippedCount ?? 0}</div>
                    <div className="text-xs text-slate-500 mt-1">Last taken: {med.lastTakenAt ? new Date(med.lastTakenAt).toLocaleString() : "never"}</div>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs border-slate-700 text-slate-300">Qty: {med.quantity ?? 0}</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">{med.notes || ""}</div>
                <div className="text-xs text-slate-500 mt-1">Profile: {med.profileId || "n/a"}</div>
                <div className="text-xs text-slate-500 mt-1">Last skipped: {med.lastSkippedAt ? new Date(med.lastSkippedAt).toLocaleString() : "never"}</div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button type="button" className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90" onClick={() => handleMedAction(med._id, "taken")}>Taken</button>
                  <button type="button" className="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90" onClick={() => handleMedAction(med._id, "skip")}>Skip dose</button>
                  <button type="button" className="rounded-lg border border-red-500/50 px-3 py-1.5 text-xs text-red-100 hover:bg-red-500/10" onClick={() => handleMedAction(med._id, "delete")}>Delete</button>

                  <div className="flex items-center gap-2">
                    <input
                      className="w-24 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs"
                      type="number"
                      placeholder="+/- qty"
                      value={inventoryAmounts[med._id] ?? ""}
                      onChange={(event) =>
                        setInventoryAmounts((prev) => ({
                          ...prev,
                          [med._id]: event.target.value
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:border-brand-400"
                      onClick={() => handleMedAction(med._id, "inventory")}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div id="messages" className="mt-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg border px-3 py-2 text-sm ${msg.type === "danger"
              ? "border-red-500/40 bg-red-500/10 text-red-100"
              : msg.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                : "border-slate-800 bg-slate-900 text-slate-200"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}
