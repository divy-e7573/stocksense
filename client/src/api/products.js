import api from "./axios";

export function listProducts(search) {
  const params = search ? { search } : {};
  return api.get("/api/products", { params }).then((r) => r.data);
}

export function createProduct(payload) {
  return api.post("/api/products", payload).then((r) => r.data);
}

export function updateProduct(id, payload) {
  return api.put(`/api/products/${id}`, payload).then((r) => r.data);
}

export function deleteProduct(id) {
  return api.delete(`/api/products/${id}`).then((r) => r.data);
}
