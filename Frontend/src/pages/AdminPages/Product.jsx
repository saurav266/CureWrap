import React, { useEffect, useState } from "react";

// ProductManagement.jsx
// Simple CRUD UI for products. Expects backend endpoints under /api/admin/products
// Endpoints used:
// GET    /api/admin/products         -> [{ id, title, price, stock, description, imageUrl }]
// POST   /api/admin/products         -> create new product (FormData for image)
// PUT    /api/admin/products/:id     -> update product (FormData optional)
// DELETE /api/admin/products/:id     -> delete product

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const initialForm = { title: "", price: "", stock: "", description: "", image: null };
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setIsEditing(false);
    setEditingProduct(null);
    setForm(initialForm);
    setShowModal(true);
  }

  function openEditModal(product) {
    setIsEditing(true);
    setEditingProduct(product);
    setForm({
      title: product.title || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      description: product.description || "",
      image: null, // keep null unless user uploads new image
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProduct(null);
    setIsEditing(false);
    setForm(initialForm);
    setSubmitting(false);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setForm((s) => ({ ...s, image: file }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Basic validation
      if (!form.title.trim()) throw new Error("Title is required");
      if (!form.price || isNaN(Number(form.price))) throw new Error("Valid price is required");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", Number(form.price));
      formData.append("stock", Number(form.stock || 0));
      formData.append("description", form.description || "");
      if (form.image) formData.append("image", form.image);

      let res;
      if (isEditing && editingProduct) {
        // update
        res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // create
        res = await fetch(`/api/admin/products`, {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Save failed");
      }

      // refresh
      await fetchProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = confirm(`Delete product "${product.title}"?`);
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      // optimistic refresh
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete failed");
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
          >
            + Add Product
          </button>
          <button
            onClick={fetchProducts}
            className="ml-2 px-3 py-2 bg-white border rounded shadow hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm text-gray-600">Image</th>
              <th className="py-3 px-4 text-left text-sm text-gray-600">Title</th>
              <th className="py-3 px-4 text-left text-sm text-gray-600">Price</th>
              <th className="py-3 px-4 text-left text-sm text-gray-600">Stock</th>
              <th className="py-3 px-4 text-left text-sm text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-red-500">{error}</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">No products</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">No
                        Image</div>
                    )}
                  </td>
                  <td className="py-3 px-4">{p.title}</td>
                  <td className="py-3 px-4">₹{p.price}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{isEditing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="mt-1 w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Price (INR)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className="mt-1 w-full border px-3 py-2 rounded"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Stock</label>
                  <input
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    className="mt-1 w-full border px-3 py-2 rounded"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="mt-1 w-full border px-3 py-2 rounded"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Image (optional)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
                {isEditing && editingProduct?.imageUrl && !form.image && (
                  <p className="text-sm text-gray-500 mt-1">Current image will remain unless you upload a new one.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded">
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
