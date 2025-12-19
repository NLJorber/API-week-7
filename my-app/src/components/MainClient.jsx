"use client";
import { useState, useCallback, useEffect } from "react";
import MedForm from "./MedForm";
// import Reminders from "./Reminders";
import MedsList from "./MedsList";
import Messages from "./Messages";

export default function MainClient() {
  const [messages, setMessages] = useState([]);
  const [meds, setMeds] = useState([]);
  const [reminders, setReminders] = useState([]);

  const setMessage = useCallback((text, type = "") => {
    const id = Math.random().toString(36).slice(2, 9);
    setMessages((m) => [{ id, text, type }, ...m]);
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((m) => m.filter((msg) => msg.id !== id));
  }, []);

  const api = useCallback(async (path, { method = "GET", body, headers = {} } = {}) => {
    const opts = { method, headers: { ...headers }, credentials: "include" };
    if (body !== undefined) {
      opts.body = typeof body === "string" ? body : JSON.stringify(body);
      opts.headers["Content-Type"] = "application/json";
    }
    const res = await fetch(path, opts);
    const text = await res.text();
    let data = {};
    if (text) {
      try { data = JSON.parse(text); } catch (_) { data = { raw: text }; }
    }
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
  }, []);

  const loadMeds = useCallback(async () => {
    try {
      const list = await api("/api/meds");
      setMeds(list);
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }, [api, setMessage]);

  const loadReminders = useCallback(async () => {
    try {
      const list = await api("/api/reminders");
      setReminders(list);
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }, [api, setMessage]);

  useEffect(() => {
    loadMeds();
    loadReminders();
  }, [loadMeds, loadReminders]);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MedForm api={api} setMessage={setMessage} loadMeds={loadMeds} />
        {/* <Reminders reminders={reminders} api={api} setMessage={setMessage} loadReminders={loadReminders} /> */}
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-semibold">Medications</h2>
          <button type="button" onClick={loadMeds} className="rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-500 hover:border-brand-400" id="load-meds">Load Meds</button>
        </div>
        <div id="meds-list" className="space-y-2">
          <MedsList meds={meds} api={api} setMessage={setMessage} loadMeds={loadMeds} />
        </div>
      </section>

      <div className="mt-3">
        <Messages messages={messages} removeMessage={removeMessage} />
      </div>
    </div>
  );
}
