import api from "./axios";

export function listReceipts(status) {
  const params = status ? { status } : {};
  return api.get("/api/receipts", { params }).then((r) => r.data);
}

export function createReceipt(payload) {
  return api.post("/api/receipts", payload).then((r) => r.data);
}

export function validateReceipt(id) {
  return api.patch(`/api/receipts/${id}/validate`).then((r) => r.data);
}
