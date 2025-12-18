"use client";
import { useState, useCallback, useEffect } from "react";
import Auth from "./Auth";
import MedForm from "./MedForm";
import Reminders from "./Reminders";
import MedsList from "./MedsList";
import Messages from "./Messages";

export default function MainClient() {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState([]);
  const [meds, setMeds] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("token") || "";
    if (saved) setToken(saved);
  }, []);

  const setMessage = useCallback((text, type = "") => {
    const id = Math.random().toString(36).slice(2, 9);
    setMessages((m) => [{ id, text, type }, ...m]);
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((m) => m.filter((msg) => msg.id !== id));
  }, []);

  const api = useCallback(async (path, { method = "GET", body, headers = {} } = {}) => {
    const opts = { method, headers: { ...headers } };
    if (body !== undefined) {
      opts.body = typeof body === "string" ? body : JSON.stringify(body);
      opts.headers["Content-Type"] = "application/json";
    }
    if (token) opts.headers["Authorization"] = "Bearer " + token;
    const res = await fetch(path, opts);
    const text = await res.text();
    let data = {};
    if (text) {
      try { data = JSON.parse(text); } catch (_) { data = { raw: text }; }
    }
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
  }, [token]);

  const loadMeds = useCallback(async () => {
    try {
      const list = await api("/");
      setMeds(list);
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }, [api, setMessage]);

  const loadReminders = useCallback(async () => {
    try {
      const list = await api("/reminders");
      setReminders(list);
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }, [api, setMessage]);

  useEffect(() => {
    if (token) {
      loadMeds();
      loadReminders();
    }
  }, [token, loadMeds, loadReminders]);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Auth token={token} setToken={setToken} api={api} setMessage={setMessage} loadMeds={loadMeds} loadReminders={loadReminders} />
        <MedForm api={api} setMessage={setMessage} loadMeds={loadMeds} />
        <Reminders reminders={reminders} api={api} setMessage={setMessage} loadReminders={loadReminders} />
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-semibold">Medications</h2>
          <button type="button" onClick={loadMeds} className="rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:border-brand-400" id="load-meds">Load Meds</button>
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
