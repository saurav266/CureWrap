// src/pages/OrderTrackingPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const backendUrl = "http://localhost:8000";

export default function OrderTrackingPage() {
  const { id } = useParams(); // order id from /orders/:id
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order details
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/orders/${id}` } });
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.order) {
          setError(data.message || "Order not found");
        } else {
          setOrder(data.order);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, token, navigate]);

  const statusSteps = useMemo(() => {
    // Default timeline shape; adjust keys to match your backend
    const timeline = order?.timeline || {};
    const createdAt = order?.createdAt || order?.placedAt;

    return [
      {
        key: "placed",
        label: "Order Placed",
        description: "We have received your order.",
        date: timeline.placed || createdAt,
      },
      {
        key: "packed",
        label: "Packed",
        description: "Your items are packed and ready to ship.",
        date: timeline.packed,
      },
      {
        key: "shipped",
        label: "Shipped",
        description: "Your order has left our facility.",
        date: timeline.shipped,
      },
      {
        key: "out_for_delivery",
        label: "Out for Delivery",
        description: "Our delivery partner is on the way.",
        date: timeline.out_for_delivery,
      },
      {
        key: "delivered",
        label: "Delivered",
        description: "Your order has been delivered.",
        date: timeline.delivered,
      },
    ];
  }, [order]);

  // Map order.status to step index
  const currentStepIndex = useMemo(() => {
    const status = order?.status;
    const map = {
      placed: 0,
      confirmed: 0,
      packed: 1,
      shipped: 2,
      in_transit: 2,
      out_for_delivery: 3,
      delivered: 4,
      completed: 4,
      cancelled: -1,
    };
    return map[status] ?? 0;
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex justify-center items-center">
        <div className="h-12 w-12 border-t-4 border-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold mb-4">{error || "Order not available"}</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  const formatDate = (d) => {
    if (!d) return null;
    const date = new Date(d);
    if (isNaN(date)) return null;
    return date.toLocaleString();
  };

  const subtotal = order.items?.reduce(
    (sum, item) => sum + (item.sale_price || item.price || 0) * (item.quantity || 1),
    0
  );

  const shippingAddress = order.shippingAddress || order.address;

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20">
      {/* Top: Title + Back */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-sm text-gray-600 mt-1">
            Order ID: <span className="font-semibold text-gray-800">{order.orderId || order._id}</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back to Orders
        </button>
      </div>

      {/* Order summary card */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h2>
          <p className="text-sm text-gray-600">
            Placed on:{" "}
            <span className="font-medium text-gray-800">
              {formatDate(order.createdAt || order.placedAt) || "—"}
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Payment:{" "}
            <span className="font-medium text-gray-800 capitalize">
              {order.paymentMode || order.payment_method || "—"}
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Status:{" "}
            <span className="font-semibold text-green-700 capitalize">
              {order.status || "placed"}
            </span>
          </p>
          <p className="text-lg font-bold text-gray-900 mt-3">
            Total: ₹{(order.total || subtotal || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Delivery Address</h2>
          {shippingAddress ? (
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold">{shippingAddress.name}</p>
              <p>{shippingAddress.line1}</p>
              {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
              </p>
              <p className="mt-1 text-gray-600">Phone: {shippingAddress.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No address info available.</p>
          )}
        </div>
      </div>

      {/* Current status pill */}
      <div className="mb-4 flex items-center gap-3">
        <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
          Current Status: {order.status?.replace(/_/g, " ") || "Placed"}
        </div>
        {formatDate(statusSteps[currentStepIndex]?.date) && (
          <div className="text-xs text-gray-500">
            Updated at: {formatDate(statusSteps[currentStepIndex]?.date)}
          </div>
        )}
      </div>

      {/* Vertical timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Shipping Timeline</h2>

        <div className="mt-2">
          {statusSteps.map((step, index) => {
            const isDone = index < currentStepIndex || formatDate(step.date);
            const isCurrent = index === currentStepIndex;
            const isFuture = index > currentStepIndex && !formatDate(step.date);

            let dotClass = "bg-gray-300 border-gray-400";
            let lineClass = "bg-gray-200";
            let titleClass = "text-gray-500";
            let descClass = "text-gray-400";

            if (isDone) {
              dotClass = "bg-green-600 border-green-600";
              lineClass = "bg-green-200";
              titleClass = "text-green-700";
              descClass = "text-gray-600";
            } else if (isCurrent) {
              dotClass = "bg-white border-green-600";
              lineClass = "bg-green-100";
              titleClass = "text-green-700";
              descClass = "text-gray-600";
            } else if (isFuture) {
              dotClass = "bg-white border-gray-300";
              lineClass = "bg-gray-200";
            }

            return (
              <div key={step.key} className="flex gap-4">
                {/* Left: dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${dotClass} shadow-sm`}
                  />
                  {index !== statusSteps.length - 1 && (
                    <div
                      className={`flex-1 w-[2px] mt-1 ${lineClass}`}
                    />
                  )}
                </div>

                {/* Right: content */}
                <div className={`pb-6 ${index === statusSteps.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${titleClass}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-green-50 text-green-700 border border-green-100">
                        In progress
                      </span>
                    )}
                    {isDone && !isCurrent && (
                      <span className="text-xs text-green-600">✓</span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${descClass}`}>{step.description}</p>
                  {formatDate(step.date) && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      {formatDate(step.date)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items list (optional) */}
      {order.items?.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Items in this Order
          </h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img
                  src={item.images?.[0]?.url || "/mnt/data/yoga-2587066_1280.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity || 1} • ₹{(item.sale_price || item.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
