import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Dashboard</h1>
      <p>Welcome{user ? `, ${user.name}` : ""}. (KPIs coming soon.)</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
