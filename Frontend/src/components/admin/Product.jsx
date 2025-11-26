import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiFillEdit, AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const backendUrl = "http://localhost:8000";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null); // For modal
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/users/products`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/users/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      toast.success(data.message);
      fetchProducts(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const getImageUrl = (img) => img?.url || "/mnt/data/yoga-2587066_1280.jpg";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Product Panel</h2>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="border p-4 rounded-lg relative">
              <img
                src={getImageUrl(p.images?.[0])}
                alt={p.name}
                className="w-full h-48 object-cover rounded mb-2 cursor-pointer"
                onClick={() => setQuickView(p)}
              />
              <h3 className="text-lg font-semibold mb-1">{p.name}</h3>
              <p className="text-green-700 font-bold">
                ₹{(p.sale_price || p.price)?.toLocaleString()}
              </p>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <AiFillEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <AiFillDelete /> Delete
                </button>
                <button
                  onClick={() => setQuickView(p)}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  <AiOutlineEye /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="absolute inset-0"
            onClick={() => setQuickView(null)}
          />
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl z-50 shadow-2xl relative">
            <button
              onClick={() => setQuickView(null)}
              className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black"
            >
              ×
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(quickView.images?.[0])}
                  alt={quickView.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {quickView.name}
                </h3>
                <p className="text-green-700 font-bold text-xl mb-3">
                  ₹{(quickView.sale_price || quickView.price).toLocaleString()}
                  {quickView.sale_price && (
                    <span className="line-through text-gray-400 text-sm ml-3">
                      ₹{quickView.price.toLocaleString()}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Stock:</strong> {quickView.stock_quantity}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Category:</strong> {quickView.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
