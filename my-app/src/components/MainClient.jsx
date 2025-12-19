"use client";
import { useState, useCallback, useEffect } from "react";
import MedForm from "./MedForm";
import Reminders from "./Reminders";
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
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { raw: text };
      }
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
    <div className="space-y-6">
      <section className="rounded-xl bg-gradient-to-br from-[#9c46e4]/90 to-[#7f3ae6]/90 p-4 shadow-xl shadow-purple-900/40 border border-white/10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Medications</h2>
        <button
          type="button"
          onClick={loadMeds}
          className="rounded-lg border border-white/70 px-4 py-2 text-sm text-white hover:border-white"
          id="load-meds"
        >
          Load Meds
        </button>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <MedForm api={api} setMessage={setMessage} loadMeds={loadMeds} />
          <section className="rounded-xl bg-gradient-to-br from-[#9c46e4]/90 to-[#7f3ae6]/90 p-4 shadow-xl shadow-purple-900/40 border border-white/10">
            <div id="meds-list" className="grid gap-3 sm:grid-cols-2">
              <MedsList meds={meds} api={api} setMessage={setMessage} loadMeds={loadMeds} />
            </div>
          </section>
        </div>
        <Reminders reminders={reminders} api={api} setMessage={setMessage} loadReminders={loadReminders} />
      </div>

      <WeeklyView />

      <Messages messages={messages} removeMessage={removeMessage} />
    </div>
  );
}

function WeeklyView() {
  const days = [
    { label: "Sun", date: "7" },
    { label: "Mon", date: "8" },
    { label: "Tue", date: "9" },
    { label: "Wed", date: "10" },
    { label: "Thu", date: "11" },
    { label: "Fri", date: "12" },
    { label: "Sat", date: "13" },
  ];

  const slots = ["10:00 AM —", "1:00 PM —", "7:00 PM —"];

  return (
    <section className="mt-6 rounded-xl bg-gradient-to-br from-[#9c46e4]/90 to-[#7f3ae6]/90 p-6 shadow-xl shadow-purple-900/40 border border-white/10">
      <h2 className="text-white text-lg font-semibold mb-4 text-center">Weekly view</h2>
      <div className="flex flex-wrap justify-center mb-8 gap-3">
        {days.map((day) => (
          <div
            key={day.label}
            className="flex group hover:bg-gradient-to-r from-cyan-300 to-sky-500 hover:shadow-lg rounded-lg mx-1 cursor-pointer justify-center w-20 md:w-24 border border-white/20 bg-white/10"
          >
            <div className="text-center px-4 py-4">
              <p className="text-white/80 group-hover:text-white text-sm transition-all group-hover:font-semibold duration-300">
                {day.label}
              </p>
              <p className="text-white/80 group-hover:text-white mt-3 group-hover:font-bold transition-all duration-300">
                {day.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="border border-white/15 bg-purple-800/60 shadow-md rounded-lg py-6 px-4 w-full space-y-2">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Events</h3>
          <ul className="flex flex-wrap gap-4 w-full">
            {slots.map((slot) => (
              <li
                key={slot}
                className="bg-purple-800/70 rounded-md p-3 text-white/90 shadow-sm flex justify-between items-center w-full sm:w-[48%] lg:w-[30%] min-w-0"
              >
                <span>{slot}</span>
                <div className="flex flex-wrap items-center space-x-2 rounded-lg border border-slate-600 px-4 py-2 hover:border-cyan-400">
                  <input type="checkbox" className="accent-cyan-400" />
                  <span className="text-sm text-slate-200">Taken</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
