// src/pages/AdminPages/AdminUserDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:8000";

export default function AdminUserDetails() {
  const { id } = useParams(); // user id
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("orders"); // "orders" | "wishlist" | "cart"
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [userRes, ordersRes, wishlistRes, cartRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
          fetch(`${BACKEND_URL}/api/admin/users/${id}/orders`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
          fetch(`${BACKEND_URL}/api/admin/users/${id}/wishlist`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
          fetch(`${BACKEND_URL}/api/admin/users/${id}/cart`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
        ]);

        const userData = await userRes.json().catch(() => ({}));
        const ordersData = await ordersRes.json().catch(() => []);
        const wishlistData = await wishlistRes.json().catch(() => []);
        const cartData = await cartRes.json().catch(() => []);

        if (!userRes.ok)
          throw new Error(userData.message || "Failed to fetch user");
        if (!ordersRes.ok)
          throw new Error(ordersData.message || "Failed to fetch orders");
        if (!wishlistRes.ok)
          throw new Error(wishlistData.message || "Failed to fetch wishlist");
        if (!cartRes.ok)
          throw new Error(cartData.message || "Failed to fetch cart");

        setUser(userData);
        setOrders(ordersData);
        setWishlist(wishlistData);
        setCart(cartData);
      } catch (err) {
        console.error("ADMIN USER DETAILS ERROR:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, token]);

  const renderTabContent = () => {
    if (tab === "orders") {
      if (orders.length === 0) {
        return <p className="text-sm text-slate-500">No orders found.</p>;
      }
      return (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-slate-200 rounded-xl p-3 text-sm"
            >
              <div className="flex justify-between">
                <span className="font-medium text-slate-800">
                  Order #{order._id}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {order.status}
                </span>
              </div>
              <p className="text-slate-600 mt-1">
                Total: ₹{order.totalAmount ?? order.total ?? "N/A"}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : ""}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (tab === "wishlist") {
      if (wishlist.length === 0) {
        return <p className="text-sm text-slate-500">Wishlist is empty.</p>;
      }
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="border border-slate-200 rounded-xl p-3 text-sm"
            >
              <p className="font-medium text-slate-800">
                {item.name || item.productName || "Product"}
              </p>
              <p className="text-slate-600">
                ₹{item.price ?? item.productPrice ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (tab === "cart") {
      if (cart.length === 0) {
        return <p className="text-sm text-slate-500">Cart is empty.</p>;
      }
      return (
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item._id}
              className="border border-slate-200 rounded-xl p-3 text-sm flex justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {item.product?.name || item.name || "Product"}
                </p>
                <p className="text-slate-600">
                  Qty: {item.quantity ?? item.qty ?? 1}
                </p>
              </div>
              <p className="text-slate-800 font-semibold">
                ₹{item.product?.price ?? item.price ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              User Details
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Orders, wishlist, and cart information.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to users
          </Link>
        </div>

        {loading && (
          <div className="py-10 text-center text-slate-500">Loading...</div>
        )}

        {error && !loading && (
          <div className="py-3 px-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && user && (
          <>
            {/* User summary */}
            <div className="mb-6 border border-slate-200 rounded-2xl p-4">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Name:</span>{" "}
                {user.name}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Email:</span>{" "}
                {user.email}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Phone:</span>{" "}
                {user.phoneno}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Role:</span>{" "}
                {user.isAdmin ? "Admin" : "User"}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-slate-200">
              {["orders", "wishlist", "cart"].map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    tab === key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {key === "orders"
                    ? "Orders"
                    : key === "wishlist"
                    ? "Wishlist"
                    : "Cart"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div>{renderTabContent()}</div>
          </>
        )}
      </div>
    </div>
  );
}
