import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/receipts", label: "Receipts" },
  { to: "/deliveries", label: "Deliveries" },
  { to: "/ledger", label: "Ledger" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkStyle = ({ isActive }) => ({
    marginRight: 16,
    textDecoration: "none",
    color: isActive ? "#0d6efd" : "#333",
    fontWeight: isActive ? 700 : 400,
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #ddd",
        fontFamily: "system-ui",
      }}
    >
      <strong style={{ marginRight: 24 }}>StockSense</strong>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} style={linkStyle}>
          {l.label}
        </NavLink>
      ))}
      <span style={{ marginLeft: "auto", marginRight: 12, color: "#666" }}>
        {user?.name}
      </span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
