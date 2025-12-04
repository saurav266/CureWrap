// src/pages/OrderTrackingPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:8000";
const RETURN_WINDOW_DAYS = 7; // should match backend

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState("");

  const [tracking, setTracking] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  // Return / replacement UI state
  const [returnReason, setReturnReason] = useState("");
  const [returnType, setReturnType] = useState(null); // "refund" | "replacement"
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnMessage, setReturnMessage] = useState("");

  // ----------------- Helpers -----------------
  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN") : "N/A";

  const currency = (n = 0) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const timelineSteps = useMemo(
    () => [
      { key: "processing", label: "Processing" },
      { key: "packed", label: "Packed" },
      { key: "shipped", label: "Shipped" },
      { key: "out_for_delivery", label: "Out for Delivery" },
      { key: "delivered", label: "Delivered" },
      { key: "cancelled", label: "Cancelled" },
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

  // ----- Cancel conditions -----
  const canCancel = useMemo(() => {
    if (!order) return false;
    const status = order.orderStatus;
    const paymentStatus = order.paymentStatus;
    // Allow cancel only before shipping
    const nonCancelable = [
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];
    if (nonCancelable.includes(status)) return false;
    if (paymentStatus === "failed") return false;
    return true;
  }, [order]);

  // ----- Retry section conditions -----
  const showRetrySection = useMemo(() => {
    if (!order) return false;
    return (
      order.paymentStatus === "pending" &&
      order.orderStatus === "cancelled"
    );
  }, [order]);

  // ----- Return / replacement window -----
  const daysLeftForReturn = useMemo(() => {
    if (!order?.deliveredAt) return 0;
    const deliveredAt = new Date(order.deliveredAt).getTime();
    const now = Date.now();
    const diffDays = Math.floor(
      (now - deliveredAt) / (1000 * 60 * 60 * 24)
    );
    const left = RETURN_WINDOW_DAYS - diffDays;
    return left > 0 ? left : 0;
  }, [order?.deliveredAt]);

  const canRequestReturn = useMemo(() => {
    if (!order) return false;
    return (
      order.orderStatus === "delivered" &&
      order.returnStatus === "none" &&
      daysLeftForReturn > 0
    );
  }, [order, daysLeftForReturn]);

  // ----------------- API Calls -----------------
  const fetchOrder = async () => {
    try {
      setLoadingOrder(true);
      setError("");
      const res = await fetch(`${BACKEND_URL}/api/orders/${id}`);
      const data = await res.json();

      if (!res.ok || !data.order) {
        setError(data.error || "Failed to fetch order");
        setOrder(null);
        return;
      }
      setOrder(data.order);
    } catch (err) {
      console.error("fetchOrder error:", err);
      setError("Failed to load order");
    } finally {
      setLoadingOrder(false);
    }
  };

  const fetchLiveTracking = async () => {
    if (!order?.shiprocket?.awb_code) return;
    try {
      setLoadingTracking(true);
      const res = await fetch(
        `${BACKEND_URL}/api/orders/track/${order.shiprocket.awb_code}`
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Tracking error:", data);
        return;
      }
      setTracking(data.tracking || null);
    } catch (err) {
      console.error("fetchLiveTracking error:", err);
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    try {
      setError("");
      // 🔧 fixed endpoint: non-admin status route
      const res = await fetch(
        `${BACKEND_URL}/api/orders/${order._id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Cancel error:", data);
        setError(data.error || "Failed to cancel order");
        return;
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Cancel request error:", err);
      setError("Failed to cancel order. Please try again.");
    }
  };

  // Refill cart from this order (used by retry + buy again)
  const refillCartFromOrder = () => {
    if (!order) return;

    const newCart = (order.items || []).map((item) => ({
      productId: item.product,
      name: item.name,
      price: item.price,
      sale_price: item.price,
      quantity: item.quantity,
      image: item.image,
      size: item.size,
      color: item.color,
    }));

    localStorage.setItem("cart", JSON.stringify(newCart));
    if (order.shippingAddress) {
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(order.shippingAddress)
      );
    }
  };

  const handleRetryPayment = () => {
    refillCartFromOrder();
    localStorage.setItem("preferredPaymentMethod", "RAZORPAY");
    navigate("/checkout");
  };

  const handleBuyAgain = () => {
    refillCartFromOrder();
    localStorage.removeItem("preferredPaymentMethod");
    navigate("/checkout");
  };

  const handleSubmitReturn = async () => {
    if (!order || !returnType) {
      setReturnMessage("Please choose refund or replacement.");
      return;
    }
    if (!returnReason.trim()) {
      setReturnMessage("Please enter a reason for return.");
      return;
    }

    try {
      setSubmittingReturn(true);
      setReturnMessage("");
      const res = await fetch(
        `${BACKEND_URL}/api/orders/${order._id}/return`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: returnType,
            reason: returnReason.trim(),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error("Return request error:", data);
        setReturnMessage(
          data.error || "Failed to submit return request."
        );
        return;
      }

      setOrder(data.order);
      setReturnMessage("Return request submitted successfully.");
    } catch (err) {
      console.error("Submit return error:", err);
      setReturnMessage("Something went wrong. Please try again.");
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Initial load + auto-refresh
  useEffect(() => {
    let interval;
    (async () => {
      await fetchOrder();
    })();

    interval = setInterval(async () => {
      await fetchOrder();
      await fetchLiveTracking();
    }, 30000);

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // load tracking once order loaded and awb available
  useEffect(() => {
    if (order?.shiprocket?.awb_code) {
      fetchLiveTracking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.shiprocket?.awb_code]);

  // ----------------- Derived tracking events -----------------
  const events = useMemo(() => {
    if (!tracking?.tracking_data) return [];
    const td = tracking.tracking_data;
    return td.shipment_track_activities || td.shipment_track || [];
  }, [tracking]);

  // ----------------- Render -----------------
  if (loadingOrder) {
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
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const awb = order.shiprocket?.awb_code;
  const courier = order.shiprocket?.courier_name;
  const trackingUrl = awb
    ? `https://shiprocket.co/tracking/${awb}`
    : null;

  const returnStatusLabel = order.returnStatus || "none";

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

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 text-sm hover:bg-gray-50"
          >
            ← Back to My Orders
          </button>
          {!showRetrySection && canCancel && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 🔔 Retry payment + Buy again section */}
      {showRetrySection && (
        <div className="mb-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <p className="text-sm font-semibold text-yellow-800 mb-2">
            Payment is still pending and this order has been cancelled.
          </p>
          <p className="text-xs text-yellow-800 mb-3">
            You can retry the payment with the same items or start a fresh
            order.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRetryPayment}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              Retry Payment
            </button>
            <button
              onClick={handleBuyAgain}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-50"
            >
              Buy Again
            </button>
          </div>
        </div>
      )}

      {/* 🔁 Return / Replacement info / actions */}
      <div className="mb-4">
        {order.orderStatus === "delivered" && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-blue-900">
                Return / Replacement
              </span>
              {order.returnStatus !== "none" && (
                <span
                  className={`px-2 py-1 rounded-full text-[11px] font-medium capitalize ${
                    order.returnStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : order.returnStatus === "requested"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.returnStatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.returnStatus}
                </span>
              )}
            </div>

            {/* Already requested / processed */}
            {order.returnStatus !== "none" && (
              <>
                <p className="text-xs text-blue-900 mb-1">
                  Type:{" "}
                  <span className="font-semibold">
                    {order.returnType || "N/A"}
                  </span>
                </p>
                {order.returnReason && (
                  <p className="text-xs text-blue-900 mb-1">
                    Reason: {order.returnReason}
                  </p>
                )}
                {order.returnAdminNote && (
                  <p className="text-xs text-blue-900 mb-1">
                    Admin note: {order.returnAdminNote}
                  </p>
                )}

                {/* Refund details */}
                {order.returnType === "refund" && order.refundInfo && (
                  <p className="text-xs text-blue-900 mt-1">
                    Refund status:{" "}
                    <span className="font-semibold">
                      {order.refundInfo.status}
                    </span>{" "}
                    {order.refundInfo.amount && (
                      <>• Amount: {currency(order.refundInfo.amount)}</>
                    )}
                  </p>
                )}

                {/* Replacement link */}
                {order.returnType === "replacement" &&
                  order.replacementOrderId && (
                    <p className="text-xs text-blue-900 mt-1">
                      Replacement order:{" "}
                      <Link
                        to={`/orders/${order.replacementOrderId}`}
                        className="text-blue-700 underline"
                      >
                        View replacement order
                      </Link>
                    </p>
                  )}
              </>
            )}

            {/* Request return / replacement form */}
            {canRequestReturn && order.returnStatus === "none" && (
              <div className="mt-3">
                <p className="text-xs text-blue-900 mb-1">
                  You have{" "}
                  <span className="font-semibold">
                    {daysLeftForReturn} day
                    {daysLeftForReturn > 1 ? "s" : ""} left
                  </span>{" "}
                  to request a return or replacement.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReturnType("refund")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      returnType === "refund"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    Refund to original payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnType("replacement")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      returnType === "replacement"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    Replacement only
                  </button>
                </div>

                <textarea
                  className="mt-3 w-full text-xs border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                  rows={3}
                  placeholder="Tell us why you want to return/replace this order..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                />

                {returnMessage && (
                  <p className="mt-1 text-xs text-red-600">
                    {returnMessage}
                  </p>
                )}

                <button
                  onClick={handleSubmitReturn}
                  disabled={submittingReturn}
                  className="mt-2 px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-60"
                >
                  {submittingReturn ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Status Timeline */}
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

        {/* Progress bar */}
        <div className="relative mt-4 mb-6">
          <div className="h-1 bg-gray-200 rounded-full" />
          <div
            className="absolute h-1 bg-green-500 rounded-full top-0 left-0 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
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

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {formatDate(order.updatedAt)}</span>
          <button
            onClick={async () => {
              await fetchOrder();
              await fetchLiveTracking();
            }}
            className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Refresh now
          </button>
        </div>
      </div>

      {/* Shipment details */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Shipment Details
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
                    : order.paymentStatus === "refunded"
                    ? "bg-blue-100 text-blue-700"
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

            {/* Show refund info if refunded */}
            {order.paymentStatus === "refunded" && order.refundInfo && (
              <p className="mt-2 text-xs text-blue-800">
                Refund processed via{" "}
                {order.refundInfo.gateway || "payment gateway"} –{" "}
                <span className="font-semibold">
                  {currency(order.refundInfo.amount || order.total)}
                </span>
                . Status:{" "}
                <span className="font-semibold">
                  {order.refundInfo.status}
                </span>
                .
              </p>
            )}
          </div>
        </div>

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
              onClick={() =>
                trackingUrl && window.open(trackingUrl, "_blank")
              }
              className="w-full md:w-auto px-4 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
            >
              Track on Shiprocket
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Shipment is being prepared. Tracking details will appear here
            once the courier is assigned.
          </p>
        )}
      </div>

      {/* Live courier scan history */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Live Shipment Activity
          </h2>
          {loadingTracking && (
            <span className="text-xs text-gray-500">
              Updating…
            </span>
          )}
        </div>

        {events && events.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {events.map((e, idx) => (
              <li
                key={idx}
                className="border-l-4 border-green-600 pl-3 py-1"
              >
                <p className="font-semibold text-gray-900">
                  {e.activity || e.current_status || "Shipment update"}
                </p>
                <p className="text-xs text-gray-500">
                  {e.location && `${e.location} · `}
                  {e.date
                    ? formatDate(e.date)
                    : e.date_time
                    ? formatDate(e.date_time)
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No courier scan updates yet. As the shipment moves, live
            updates will show here.
          </p>
        )}
      </div>

      {/* Items list */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Items ({order.items?.length || 0})
        </h2>
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
          <p className="text-sm text-gray-500">
            No items found in this order.
          </p>
        )}
      </div>
    </div>
  );
}
