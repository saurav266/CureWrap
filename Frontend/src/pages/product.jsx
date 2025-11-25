// src/components/ProductSection.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/products");
        const data = await res.json();
        if (Array.isArray(data.products)) setProducts(data.products);
        else setProducts([]);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update cart count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  // Initialize cart count and listen for cart updates
  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
      cart = cart.map((item) => (item._id === product._id ? existing : item));
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <p className="p-10 text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <section className="p-10 bg-gray-50 relative">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Cart Icon */}
      <div className="fixed top-5 right-5 z-50">
        <Link to="/cart" className="relative">
          <svg
            className="w-8 h-8 text-gray-700 hover:text-green-600 transition"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 3h2l.4 2M7 13h14l-1.35 6H6.35L5 6H21" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Our Products
      </h2>

      {products.length === 0 && <p className="text-center text-gray-500">No products available</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p) => {
          const primaryImage =
            p?.images?.find((img) => img.is_primary)?.url ||
            p?.images?.[0]?.url ||
            "https://placehold.co/400x400?text=No+Image";

          const isOnSale = p.sale_price && p.sale_price < p.price;

          return (
            <div
              key={p._id}
              className="border rounded-lg shadow bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <Link to={`/product/${p._id}`}>
                <div className="w-full h-56 bg-gray-100 mb-4 relative overflow-hidden">
                  <img
                    src={primaryImage}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {isOnSale && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                      SALE
                    </span>
                  )}
                </div>
              </Link>

              <div className="px-5 pb-5 flex-1 flex flex-col">
                <Link to={`/product/${p._id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-green-600 truncate">
                    {p.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {p.short_description || p.description || "No description available."}
                </p>

                <div className="mt-auto">
                  <p className="text-green-600 font-bold text-lg">
                    {isOnSale ? (
                      <>
                        ₹{p.sale_price.toLocaleString()}{" "}
                        <span className="line-through text-gray-400 text-sm">
                          ₹{p.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      `₹${p.price.toLocaleString()}`
                    )}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => addToCart(p)}
                      className="flex-1 py-2 border rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${p._id}`}
                      className="flex-1 py-2 border rounded bg-green-600 text-white font-semibold text-center hover:bg-green-700 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
