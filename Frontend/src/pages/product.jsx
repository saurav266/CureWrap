import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/products");
        const data = await res.json();

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    alert("Product added to cart!");
  };

  return (
    <section className="p-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>

      {products.length === 0 && (
        <p className="text-center text-gray-500">No products available</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((p) => {
          const primaryImage =
            p?.images?.find((img) => img.is_primary)?.url ||
            p?.images?.[0]?.url ||
            "https://placehold.co/400x400?text=No+Image";

          return (
            <div
              key={p._id}
              className="border p-5 rounded-lg shadow bg-white hover:shadow-md transition-shadow"
            >
              {/* Wrap image + name in Link */}
              <Link to={`/product/${p._id}`}>
                <div className="w-full h-56 bg-gray-100 mb-4 rounded overflow-hidden">
                  <img
                    src={primaryImage}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold hover:text-green-600">
                  {p.name}
                </h3>
              </Link>

              <p className="text-gray-600 mt-1">
                {p.description || "No description available."}
              </p>

              <p className="text-green-600 font-bold text-lg mt-3">
                ₹{p.price} {p.currency}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => addToCart(p)}
                  className="w-1/2 py-2 border rounded bg-yellow-500 text-white font-semibold"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/product/${p._id}`}
                  className="w-1/2 py-2 border rounded bg-green-600 text-white font-semibold text-center"
                >
                  View
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}