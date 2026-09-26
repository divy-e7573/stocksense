import api from "./axios";

export function getDashboard() {
  return api.get("/api/dashboard").then((r) => r.data);
}
