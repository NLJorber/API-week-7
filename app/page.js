export default function Home() {
  return (
    <main style={{ padding: "32px", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "12px" }}>Medication Manager</h1>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Hi I think its working.
      </p>
      <div style={{ background: "#f5f5f5", padding: "16px", borderRadius: "8px" }}>
        <p style={{ margin: 0 }}>Backend routes so we dont forget lol:</p>
        <ul>
          <li>/api/auth/signup</li>
          <li>/api/auth/login</li>
          <li>/api/meds</li>
          <li>/api/reminders</li>
        </ul>
      </div>
    </main>
  );
}
