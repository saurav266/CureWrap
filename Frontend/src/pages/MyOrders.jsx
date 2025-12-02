// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const BACKEND_URL = "http://localhost:8000";

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currency = (n = 0) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN") : "N/A";

  const getAuthHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }
    return headers;
  };

  const fetchOrders = async () => {
    try {
      if (!user) {
        setError("Please login to see your orders");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const userId = user._id || user.id;
      const res = await fetch(
        `${BACKEND_URL}/api/orders/my-orders?userId=${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch your orders");
        setOrders([]);
        return;
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setError("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600 mb-4">
          Please log in to view your orders.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin border-4 border-gray-300 border-t-green-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage your recent orders.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!orders.length ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">
            You haven&apos;t placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/product")}
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-5 flex flex-col gap-3"
            >
              {/* Top row: ID + date + status */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono text-sm break-all">{order._id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.orderStatus?.replace(/_/g, " ") || "processing"}
                  </span>
                </div>

                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Payment</p>
                  <p className="font-semibold">
                    {order.paymentMethod}{" "}
                    <span
                      className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>

                <div className="text-right text-sm">
                  <p className="text-gray-500 mb-1">Total</p>
                  <p className="font-extrabold text-green-700">
                    {currency(order.total)}
                  </p>
                </div>
              </div>

              {/* Items short summary + mini content */}
              <div className="border-t border-dashed mt-3 pt-3 text-sm flex flex-col gap-3">
                {/* Short text summary */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-gray-700">
                    {order.items && order.items.length > 0 ? (
                      <>
                        <span className="font-semibold">
                          {order.items[0].name}
                        </span>
                        {order.items.length > 1 && (
                          <span className="text-gray-500">
                            {" "}
                            + {order.items.length - 1} more item
                            {order.items.length - 1 > 1 ? "s" : ""}
                          </span>
                        )}
                      </>
                    ) : (
                      <span>No items</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <Link to={`/orders/${order._id}`}>
                      <button className="px-3 py-1.5 text-xs md:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Track Order
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Detailed items preview with size & colour */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-1 space-y-2">
                    <div className="text-xs text-gray-500">
                      Order items:
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 border border-gray-100 rounded-lg px-2 py-2 bg-gray-50"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded object-cover border"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-semibold line-clamp-1">
                              {item.name}
                            </p>

                            {/* Size & Colour */}
                            <p className="text-xs text-gray-600">
                              Size:{" "}
                              <span className="font-medium">
                                {item.size || "N/A"}
                              </span>
                              {" • "}
                              Colour:{" "}
                              <span className="font-medium">
                                {item.color || "N/A"}
                              </span>
                            </p>

                            <p className="text-xs text-gray-500 mt-0.5">
                              Qty: {item.quantity} • Price:{" "}
                              {currency(item.price)}
                            </p>
                            <p className="text-xs font-medium text-gray-700">
                              Subtotal:{" "}
                              {currency(
                                (item.price || 0) * (item.quantity || 0)
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.items.length > 3 && (
                      <div className="text-xs text-gray-500">
                        + {order.items.length - 3} more item
                        {order.items.length - 3 > 1 ? "s" : ""} in this order
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
