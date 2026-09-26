import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>StockSense</h1>
      {error && <p style={{ color: "red" }}>API error: {error}</p>}
      {!error && !health && <p>Checking API connection…</p>}
      {health && (
        <p style={{ color: "green" }}>
          API status: <strong>{health.status}</strong>
        </p>
      )}
    </div>
  );
}
