import { createContext, useContext, useState } from "react";
import api, { TOKEN_KEY } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("stocksense_user");
    return raw ? JSON.parse(raw) : null;
  });

  function persist(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem("stocksense_user", JSON.stringify(nextUser));
  }

  async function signup(name, email, password) {
    const { data } = await api.post("/api/auth/signup", { name, email, password });
    persist(data.token, data.user);
    return data.user;
  }

  async function login(email, password) {
    const { data } = await api.post("/api/auth/login", { email, password });
    persist(data.token, data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("stocksense_user");
  }

  return (
    <AuthContext.Provider value={{ token, user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
