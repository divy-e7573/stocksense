import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome{user ? `, ${user.name}` : ""}. (KPIs coming soon.)</p>
    </div>
  );
}
