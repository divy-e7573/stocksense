import api from "./axios";

export function listDeliveries(status) {
  const params = status ? { status } : {};
  return api.get("/api/deliveries", { params }).then((r) => r.data);
}

export function createDelivery(payload) {
  return api.post("/api/deliveries", payload).then((r) => r.data);
}

export function validateDelivery(id) {
  return api.patch(`/api/deliveries/${id}/validate`).then((r) => r.data);
}
