"use client";
import { useState, useEffect } from "react";

export default function Auth({ token, setToken, api, setMessage, loadMeds, loadReminders }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("token") || "";
    if (saved && !token) setToken(saved);
  }, [token, setToken]);

  function updateAuthStorage(newToken) {
    setToken(newToken);
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
  }

  async function login(e) {
    e.preventDefault();
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      updateAuthStorage(data.token);
      setMessage("Logged in", "success");
      loadMeds();
      loadReminders();
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }

  async function signup() {
    try {
      const name = email.split("@")[0] || "User";
      await api("/auth/signup", { method: "POST", body: { email, password: password || "password123", name } });
      setMessage("Signup success, now log in.", "success");
    } catch (err) {
      setMessage(err.message, "danger");
    }
  }

  function logout() {
    updateAuthStorage("");
    setMessage("Logged out");
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/40">
      <h2 className="text-lg font-semibold mb-2">Auth</h2>
      <form id="login-form" className="space-y-3" onSubmit={login}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm text-slate-400 space-y-1">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} id="login-email" type="email" placeholder="you@example.com" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
          <label className="text-sm text-slate-400 space-y-1">
            <span>Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} id="login-password" type="password" placeholder="password" required className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400" />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:opacity-90">Login</button>
          <button type="button" onClick={signup} className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-200 hover:border-brand-400" id="signup-btn">Quick Sign Up</button>
          <button type="button" onClick={logout} className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-200 hover:border-brand-400" id="logout-btn">Logout</button>
        </div>
      </form>
    </section>
  );
}
