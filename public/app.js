const messagesEl = document.getElementById("messages");
const authStatusEl = document.getElementById("auth-status");
let token = localStorage.getItem("token") || "";

function setMessage(text, type = "") {
  const el = document.createElement("div");
  const base = "rounded-lg border px-3 py-2 text-sm";
  const variants = {
    "": "border-slate-800 bg-slate-900 text-slate-200",
    danger: "border-red-500/40 bg-red-500/10 text-red-100",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
  };
  el.className = base + " " + (variants[type] || variants[""]);
  el.textContent = text;
  messagesEl.prepend(el);
  setTimeout(() => el.remove(), 6000);
}

function updateAuthStatus() {
  if (token) {
    authStatusEl.textContent = "Authenticated";
    authStatusEl.className = "rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100";
  } else {
    authStatusEl.textContent = "Not authenticated";
    authStatusEl.className = "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200";
  }
}

updateAuthStatus();

async function api(path, { method = "GET", body, headers = {} } = {}) {
  const opts = { method, headers: { ...headers } };
  if (body !== undefined) {
    opts.body = typeof body === "string" ? body : JSON.stringify(body);
    opts.headers["Content-Type"] = "application/json";
  }
  if (token) {
    opts.headers["Authorization"] = "Bearer " + token;
  }
  const res = await fetch(path, opts);
  const text = await res.text();
  let data = {};
  if (text) {
    try { data = JSON.parse(text); } catch (_) { data = { raw: text }; }
  }
  if (!res.ok) {
    throw new Error(data.message || res.statusText);
  }
  return data;
}

// Auth
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      token = data.token;
      localStorage.setItem("token", token);
      updateAuthStatus();
      setMessage("Logged in", "success");
      loadMeds();
      loadReminders();
    } catch (error) {
      setMessage(error.message, "danger");
    }
  });
}

const signupBtn = document.getElementById("signup-btn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value || "password123";
    const name = email.split("@")[0] || "User";
    try {
      await api("/auth/signup", { method: "POST", body: { email, password, name } });
      setMessage("Signup success, now log in.", "success");
    } catch (error) {
      setMessage(error.message, "danger");
    }
  });
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    token = "";
    localStorage.removeItem("token");
    updateAuthStatus();
    setMessage("Logged out");
  });
}

// Med create/update
const medForm = document.getElementById("med-form");
if (medForm) {
  medForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("med-id").value.trim();
    const dosageAmountInput = document.getElementById("med-dosage-amount").value;
    const dosageAmount = dosageAmountInput === "" ? undefined : Number(dosageAmountInput);
    const dosageUnit = document.getElementById("med-dosage-unit").value || undefined;

    const body = {
      name: document.getElementById("med-name").value,
      dosage: document.getElementById("med-dosage").value,
      dosageAmount,
      dosageUnit,
      timeToTake: document.getElementById("med-time").value,
      frequency: document.getElementById("med-frequency").value,
      notes: document.getElementById("med-notes").value,
      profileId: document.getElementById("med-profile").value || undefined,
      quantity: Number(document.getElementById("med-quantity").value || 0)
    };
    try {
      if (id) {
        await api(`/${id}`, { method: "PUT", body });
        setMessage("Medication updated", "success");
      } else {
        await api("/", { method: "POST", body });
        setMessage("Medication created", "success");
      }
      loadMeds();
    } catch (error) {
      setMessage(error.message, "danger");
    }
  });
}

const loadMedsBtn = document.getElementById("load-meds");
if (loadMedsBtn) {
  loadMedsBtn.addEventListener("click", () => loadMeds());
}

async function loadMeds() {
  try {
    const meds = await api("/");
    renderMeds(meds);
  } catch (error) {
    setMessage(error.message, "danger");
  }
}

function renderMeds(meds) {
  const container = document.getElementById("meds-list");
  if (!container) return;
  if (!Array.isArray(meds) || meds.length === 0) {
    container.innerHTML = '<div class="text-sm text-slate-500">No meds found</div>';
    return;
  }
  container.innerHTML = "";
  meds.forEach((med) => {
    const card = document.createElement("div");
    card.className = "rounded-xl border border-slate-800 bg-slate-950 px-3 py-3";
    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="font-semibold text-slate-100">${med.name}</div>
          <div class="text-xs text-slate-400">${med.dosage} • ${med.frequency} • ${med.timeToTake}</div>
          ${med.dosageAmount ? `<div class="text-xs text-slate-500">Amount: ${med.dosageAmount} ${med.dosageUnit || ""}</div>` : ""}
        </div>
        <span class="inline-flex items-center rounded-full border px-2 py-1 text-xs border-slate-700 text-slate-300">
          Qty: ${med.quantity ?? 0}
        </span>
      </div>
      <div class="text-xs text-slate-400 mt-2">${med.notes || ""}</div>
      <div class="text-xs text-slate-500 mt-1">Profile: ${med.profileId || "n/a"}</div>
      <div class="text-xs text-slate-500 mt-1">Last skipped: ${med.lastSkippedAt ? new Date(med.lastSkippedAt).toLocaleString() : "never"}</div>
      <div class="flex flex-wrap items-center gap-2 mt-3">

      <button data-action="taken" data-id="${med._id}"
      class="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90">
      Taken
    </button>


        <button data-action="skip" data-id="${med._id}" class="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90">Skip dose</button>
        
        <button data-action="delete" data-id="${med._id}" class="rounded-lg border border-red-500/50 px-3 py-1.5 text-xs text-red-100 hover:bg-red-500/10">Delete</button>
        
        <div class="flex items-center gap-2">
          <input data-id="${med._id}" data-role="inventory-amount" class="w-24 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs" type="number" placeholder="+/- qty" />
          
          <button data-action="inventory" data-id="${med._id}" class="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:border-brand-400">Add</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      try {
        if (action === "delete") {
          await api(`/${id}`, { method: "DELETE" });
          setMessage("Deleted", "success");
        } else if (action === "skip") {
          await api(`/${id}/skip`, { method: "POST", body: { reason: "manual skip" } });
          setMessage("Marked skipped", "success");
        } else if (action === "inventory") {
          const input = container.querySelector(`input[data-role="inventory-amount"][data-id="${id}"]`);
          const amount = Number(input.value);
          if (Number.isNaN(amount)) return setMessage("Enter a number for inventory", "danger");
          await api(`/meds/${id}/inventory`, { method: "PATCH", body: { amount } });
          setMessage("Inventory updated", "success");
        } else if (action === "taken") {
        await api(`/meds/${id}/taken`, { method: "POST" });
        setMessage("Marked taken", "success");
        }
        loadMeds();
      } catch (error) {
        setMessage(error.message, "danger");
      }
    });
  });
}

// Reminders
const reminderForm = document.getElementById("reminder-form");
if (reminderForm) {
  reminderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dueRaw = document.getElementById("reminder-due").value;
    const dueAt = dueRaw ? new Date(dueRaw).toISOString() : null;
    const body = {
      message: document.getElementById("reminder-message").value,
      medId: document.getElementById("reminder-med").value || undefined,
      dueAt
    };
    try {
      await api("/reminders", { method: "POST", body });
      setMessage("Reminder created", "success");
      loadReminders();
    } catch (error) {
      setMessage(error.message, "danger");
    }
  });
}

const refreshRemindersBtn = document.getElementById("refresh-reminders");
if (refreshRemindersBtn) {
  refreshRemindersBtn.addEventListener("click", loadReminders);
}

async function loadReminders() {
  try {
    const reminders = await api("/reminders");
    renderReminders(reminders);
  } catch (error) {
    setMessage(error.message, "danger");
  }
}

function renderReminders(reminders) {
  const container = document.getElementById("reminders-list");
  if (!container) return;
  if (!Array.isArray(reminders) || reminders.length === 0) {
    container.innerHTML = '<div class="text-sm text-slate-500">No reminders found</div>';
    return;
  }
  container.innerHTML = "";
  reminders.forEach((rem) => {
    const card = document.createElement("div");
    const due = rem.status === "due";
    card.className = "rounded-xl border border-slate-800 bg-slate-950 px-3 py-3";
    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="font-semibold text-slate-100">${rem.message}</div>
          <div class="text-xs text-slate-400">Due: ${new Date(rem.dueAt).toLocaleString()}</div>
        </div>
        <span class="inline-flex items-center rounded-full border px-2 py-1 text-xs ${due ? "border-amber-400/50 text-amber-200" : "border-slate-700 text-slate-300"}">
          ${rem.status}
        </span>
      </div>
      <div class="text-xs text-slate-500 mt-2">Med: ${rem.medId || "n/a"}</div>
      <div class="flex flex-wrap gap-2 mt-3">
        <button data-action="dismiss" data-id="${rem._id}" class="rounded-lg bg-brand-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:opacity-90">Dismiss</button>
        <button data-action="mark-due" data-id="${rem._id}" class="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:border-brand-400">Mark Due</button>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
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
    });
  });
}

// Auto load if token present
if (token) {
  loadMeds();
  loadReminders();
}
