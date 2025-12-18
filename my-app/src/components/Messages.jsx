"use client";
import { useEffect } from "react";

export default function Messages({ messages, removeMessage }) {
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const timers = messages.map((m) =>
      setTimeout(() => removeMessage(m.id), 6000)
    );
    return () => timers.forEach(clearTimeout);
  }, [messages, removeMessage]);

  return (
    <div id="messages" className="mt-3 space-y-2">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded-lg border px-3 py-2 text-sm ${
            m.type === "danger"
              ? "border-red-500/40 bg-red-500/10 text-red-100"
              : m.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : "border-slate-800 bg-slate-900 text-slate-200"
          }`}
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}
