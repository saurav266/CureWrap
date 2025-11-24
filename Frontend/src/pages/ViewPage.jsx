// src/pages/ProductViewPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProductViewPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/users/products/${id}`);
        const data = await res.json();

        if (data?.product) {
          setProduct(data.product);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
      cart = cart.map((item) =>
        item._id === product._id ? existing : item
      );
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Product added to cart!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={
              product.images?.[0]?.url ||
              "https://placehold.co/400x400?text=No+Image"
            }
            alt={product.name || "Product image"}
            className="w-full h-96 object-cover rounded-lg shadow"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-green-600 font-bold text-2xl mb-6">
            ₹{product.price}
          </p>

          <div className="flex gap-4">
            <button
              onClick={addToCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Add to Cart
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}