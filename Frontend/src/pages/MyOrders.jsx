// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const backendUrl = "http://localhost:8000";

export default function MyOrders() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if NOT logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token, navigate]);

  const formatDate = (date) => new Date(date).toLocaleDateString();

  // calculate remaining replacement days
  const getRemainingDays = (item, deliveredDate) => {
    if (!item?.product?.return_policy?.days || !deliveredDate) return null;
    const policyDays = item.product.return_policy.days;
    const diffDays =
      policyDays -
      Math.floor((Date.now() - new Date(deliveredDate)) / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="h-12 w-12 rounded-full border-t-4 border-green-600 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-gray-600 gap-3">
        <span className="text-6xl">📭</span>
        <p className="text-lg font-medium">No orders found.</p>
        <button
          onClick={() => navigate("/product")}
          className="mt-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

      <div className="space-y-5">
        {orders.map((order) => {
          const total = order.total || 0;
          const status = order.status || "placed";

          const statusColors = {
            placed: "text-blue-600 bg-blue-100",
            packed: "text-indigo-600 bg-indigo-100",
            shipped: "text-purple-600 bg-purple-100",
            out_for_delivery: "text-orange-600 bg-orange-100",
            delivered: "text-green-600 bg-green-100",
            cancelled: "text-red-600 bg-red-100",
          };

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* LEFT PART — Order Summary */}
              <div>
                <p className="text-sm text-gray-500">
                  Order ID: <span className="font-medium text-gray-700">{order.orderId || order._id}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on: {formatDate(order.createdAt || order.placedAt)}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-2">₹{total.toLocaleString()}</p>

                {/* Status Badge */}
                <span
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    statusColors[status] || "bg-gray-200 text-gray-700"
                  }`}
                >
                  {status.replace(/_/g, " ")}
                </span>

                {/* ⭐ Remaining Days to Request Replacement — only after delivery */}
                {status === "delivered" && (
                  (() => {
                    // find highest remaining among items
                    let highestRemaining = 0;
                    order.items?.forEach((item) => {
                      const daysLeft = getRemainingDays(item, order.deliveredAt);
                      if (daysLeft > highestRemaining) highestRemaining = daysLeft;
                    });
                    return highestRemaining > 0 ? (
                      <p className="mt-2 text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-lg inline-block">
                        🔄 {highestRemaining} days left to request replacement
                      </p>
                    ) : (
                      <p className="mt-2 text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-lg inline-block">
                        ⛔ Replacement window expired
                      </p>
                    );
                  })()
                )}
              </div>

              {/* CENTER — Items Preview */}
              <div className="flex -space-x-3">
                {order.items?.slice(0, 3).map((it, idx) => (
                  <img
                    key={idx}
                    src={it.images?.[0]?.url || "https://placehold.co/60"}
                    alt="product"
                    className="w-12 h-12 object-cover rounded-full border shadow-sm"
                  />
                ))}
                {order.items?.length > 3 && (
                  <div className="w-12 h-12 rounded-full bg-gray-300 grid place-items-center text-sm font-semibold">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              {/* RIGHT PART — Buttons */}
              <div className="flex gap-3">
                <Link
                  to={`/orders/${order._id}`}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                >
                  Track Order
                </Link>
                <button
                  onClick={() => navigate(`/product`)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 font-medium"
                >
                  Buy Again
                </button>
              </div>
              {order.status === "delivered" && remainingDays > 0 && (
                <button
                  onClick={() => setShowReplacementModal(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Request Replacement
                </button>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
