// src/pages/OrderTrackingPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = "";

export default function OrderTrackingPage() {
  const { id } = useParams(); // order ID
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order by ID
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BACKEND_URL}/api/orders/${id}`);
      const data = await res.json();

      if (!res.ok || !data.order) {
        setError(data.error || "Order not found");
        setOrder(null);
        return;
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Fetch order error:", err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN") : "N/A";

  const currency = (n = 0) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // Timeline steps
  const timelineSteps = useMemo(
    () => [
      { key: "processing", label: "Processing" },
      { key: "packed", label: "Packed" },
      { key: "shipped", label: "Shipped" },
      { key: "out_for_delivery", label: "Out for Delivery" },
      { key: "delivered", label: "Delivered" },
    ],
    []
  );

  const activeIndex = useMemo(() => {
    if (!order?.orderStatus) return 0;
    const idx = timelineSteps.findIndex(
      (s) => s.key === order.orderStatus
    );
    return idx === -1 ? 0 : idx;
  }, [order, timelineSteps]);

  const progressPercent = useMemo(() => {
    if (timelineSteps.length <= 1) return 0;
    return (activeIndex / (timelineSteps.length - 1)) * 100;
  }, [activeIndex, timelineSteps.length]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin border-4 border-gray-300 border-t-green-600 rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <p className="text-red-600 font-semibold mb-3">
          {error || "Order not found"}
        </p>
        <button
          onClick={() => navigate("/my-orders")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const awb = order.shiprocket?.awb_code;
  const courier = order.shiprocket?.courier_name;
  const labelUrl = order.shiprocket?.label_url;
  const trackingUrl = awb
    ? `https://shiprocket.co/tracking/${awb}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Track Your Order
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Order ID:{" "}
            <span className="font-mono text-xs md:text-sm">
              {order._id}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <button
          onClick={() => navigate("/my-orders")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 text-sm hover:bg-gray-50"
        >
          ← Back to My Orders
        </button>
      </div>

      {/* Animated Timeline Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Order Status
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Current status:{" "}
          <span className="font-semibold capitalize text-green-700">
            {order.orderStatus?.replace(/_/g, " ") || "processing"}
          </span>
        </p>

        {/* Progress bar background */}
        <div className="relative mt-4 mb-6">
          <div className="h-1 bg-gray-200 rounded-full" />

          {/* Animated green bar */}
          <div
            className="absolute h-1 bg-green-500 rounded-full top-0 left-0 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Dots */}
          <div className="absolute inset-0 flex justify-between items-center">
            {timelineSteps.map((step, idx) => {
              const isActive = idx <= activeIndex;
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center w-full"
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 transition-all duration-500 ${
                      isActive
                        ? "bg-green-500 border-green-600"
                        : "bg-white border-gray-300"
                    } ${isCurrent ? "scale-110 shadow-lg" : ""}`}
                  />
                  <span
                    className={`mt-2 text-[11px] md:text-xs font-medium text-center transition-colors duration-500 ${
                      isActive ? "text-green-700" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Last updated: {formatDate(order.updatedAt)}
        </p>
      </div>

      {/* Shipment details */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Shipment Details
        </h2>

        {awb ? (
          <>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">AWB:</span> {awb}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <span className="font-semibold">Courier:</span>{" "}
              {courier || "N/A"}
            </p>

            <button
              onClick={() => trackingUrl && window.open(trackingUrl, "_blank")}
              className="w-full py-2.5 mb-3 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
            >
              Track Shipment on Shiprocket
            </button>

            {labelUrl && (
              <button
                onClick={() => window.open(labelUrl, "_blank")}
                className="w-full py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700"
              >
                Download Shipping Label
              </button>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Shipment is being prepared. Tracking details will appear here
            once the courier is assigned.
          </p>
        )}
      </div>

      {/* Order & items summary */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Order Summary
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-500 mb-1">Shipping To</p>
            <p className="font-semibold">
              {order.shippingAddress?.name || "Customer"}
            </p>
            <p className="text-gray-700">
              {order.shippingAddress?.addressLine1}
            </p>
            {order.shippingAddress?.addressLine2 && (
              <p className="text-gray-700">
                {order.shippingAddress?.addressLine2}
              </p>
            )}
            <p className="text-gray-700">
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state}{" "}
              {order.shippingAddress?.postalCode}
            </p>
            <p className="text-gray-700">
              {order.shippingAddress?.country}
            </p>
            <p className="text-gray-700 mt-1">
              📞 {order.shippingAddress?.phone}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Payment</p>
            <p className="font-semibold">
              {order.paymentMethod}{" "}
              <span
                className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : order.paymentStatus === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {currency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {order.shippingCharges
                    ? currency(order.shippingCharges)
                    : "Free"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  {currency(order.tax)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-1 mt-1">
                <span className="font-semibold text-gray-800">
                  Total
                </span>
                <span className="font-extrabold text-green-700">
                  {currency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Items ({order.items?.length || 0})
        </h3>
        {order.items?.length ? (
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border rounded-lg px-3 py-2 bg-gray-50 text-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {currency(item.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currency(item.price * item.quantity)} total
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No items in this order.</p>
        )}
      </div>
    </div>
  );
}
