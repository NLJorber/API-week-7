"use client";
import { useEffect } from "react";

export default function Messages({ messages, removeMessage }) {
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const timers = messages.map((m) => setTimeout(() => removeMessage(m.id), 6000));
    return () => timers.forEach(clearTimeout);
  }, [messages, removeMessage]);

  return (
    <div id="messages" className="fixed top-6 right-6 z-50 space-y-2 min-w-[240px] max-w-md">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded-lg border px-4 py-3 text-sm shadow-xl ${
            m.type === "danger"
              ? "border-pink-200 bg-pink-50 text-pink-700 shadow-pink-500/20"
              : m.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-500/20"
              : "border-slate-200 bg-white text-slate-700 shadow-black/10"
          }`}
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}
