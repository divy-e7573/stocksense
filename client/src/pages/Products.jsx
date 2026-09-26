import { useEffect, useState } from "react";
import { listProducts, createProduct } from "../api/products";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  unit: "pcs",
  currentStock: 0,
  reorderThreshold: 0,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setProducts(await listProducts());
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const created = await createProduct({
        ...form,
        currentStock: Number(form.currentStock),
        reorderThreshold: Number(form.reorderThreshold),
      });
      // Prepend to the list so it appears without a refresh.
      setProducts((prev) => [created, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.error || "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1 style={{ marginRight: "auto" }}>Products</h1>
        <button onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ New Product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 16,
            margin: "12px 0",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          <input name="name" placeholder="Name" value={form.name} onChange={updateField} required />
          <input name="sku" placeholder="SKU" value={form.sku} onChange={updateField} required />
          <input name="category" placeholder="Category" value={form.category} onChange={updateField} />
          <input name="unit" placeholder="Unit" value={form.unit} onChange={updateField} />
          <input name="currentStock" type="number" min="0" placeholder="Opening stock" value={form.currentStock} onChange={updateField} />
          <input name="reorderThreshold" type="number" min="0" placeholder="Reorder threshold" value={form.reorderThreshold} onChange={updateField} />
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 12 }}>
            <button type="submit" disabled={saving}>{saving ? "Saving…" : "Create"}</button>
            {formError && <span style={{ color: "red" }}>{formError}</span>}
          </div>
        </form>
      )}

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: 8 }}>Name</th>
              <th style={{ padding: 8 }}>SKU</th>
              <th style={{ padding: 8 }}>Category</th>
              <th style={{ padding: 8 }}>Stock</th>
              <th style={{ padding: 8 }}>Reorder @</th>
              <th style={{ padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 12, color: "#666" }}>
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((p) => {
              const low = p.currentStock <= p.reorderThreshold;
              return (
                <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{p.name}</td>
                  <td style={{ padding: 8 }}>{p.sku}</td>
                  <td style={{ padding: 8 }}>{p.category}</td>
                  <td style={{ padding: 8, fontWeight: low ? 700 : 400, color: low ? "#c0392b" : "inherit" }}>
                    {p.currentStock} {p.unit}
                  </td>
                  <td style={{ padding: 8 }}>{p.reorderThreshold}</td>
                  <td style={{ padding: 8 }}>
                    {low ? (
                      <span style={{ background: "#fdecea", color: "#c0392b", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>
                        Low stock
                      </span>
                    ) : (
                      <span style={{ background: "#eafaf1", color: "#1e824c", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
