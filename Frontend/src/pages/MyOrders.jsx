// src/pages/MyOrders.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const BACKEND_URL = ""; // Adjust as needed

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Return modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnComment, setReturnComment] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const currency = (n = 0) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const formatDateTime = (d) =>
    d ? new Date(d).toLocaleString("en-IN") : "N/A";

  // ----------------- Helpers -----------------

  const getAuthHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }
    return headers;
  };

  // 7-day default return window (you can change or read from backend)
  const RETURN_WINDOW_DAYS = 7;

  const daysBetween = (from, to = new Date()) => {
    if (!from) return Infinity;
    const diffMs = new Date(to).getTime() - new Date(from).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  const isReturnEligible = (order) => {
    if (!order) return false;

    // Only delivered orders can be returned
    if (order.orderStatus !== "delivered") return false;

    // If there is already a return in progress/completed, don't allow again
    if (
      order.returnStatus &&
      order.returnStatus !== "none" &&
      order.returnStatus !== "rejected"
    ) {
      return false;
    }

    // Determine the "delivered" timestamp
    const deliveredAt = order.deliveredAt || order.updatedAt || order.createdAt;
    const diffDays = daysBetween(deliveredAt);

    const windowDays = order.returnWindowDays || RETURN_WINDOW_DAYS;
    return diffDays >= 0 && diffDays <= windowDays;
  };

  const getReturnBadge = (order) => {
    if (!order?.returnStatus || order.returnStatus === "none") return null;

    const status = order.returnStatus;
    if (status === "requested") {
      return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-100 text-yellow-800">
          Return requested
        </span>
      );
    }
    if (status === "approved") {
      return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-800">
          Return approved
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-100 text-red-700">
          Return rejected
        </span>
      );
    }
    return null;
  };

  const getReturnInfoText = (order) => {
    if (!order) return "";
    if (order.returnStatus === "requested") {
      return "Your return request is under review.";
    }
    if (order.returnStatus === "approved") {
      return "Return has been approved. Please follow instructions shared by support.";
    }
    if (order.returnStatus === "rejected") {
      return (
        order.returnAdminNote ||
        "Your return request was not approved. Please contact support if needed."
      );
    }
    if (isReturnEligible(order)) {
      const deliveredAt = order.deliveredAt || order.updatedAt || order.createdAt;
      const diffDays = daysBetween(deliveredAt);
      const windowDays = order.returnWindowDays || RETURN_WINDOW_DAYS;
      const remaining = Math.max(0, windowDays - diffDays);
      return `You can request a return for this order within ${remaining} more day${
        remaining === 1 ? "" : "s"
      }.`;
    }
    return "";
  };

  // ----------------- API: Fetch Orders -----------------

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

      if (!res.ok || !data.success) {
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
    if (!user) {
      // redirect to login if not logged in
      navigate("/login", { state: { from: "/orders" } });
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ----------------- Return Request Handlers -----------------

  const openReturnModal = (order) => {
    setSelectedOrder(order);
    setReturnReason("");
    setReturnComment("");
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedOrder(null);
    setReturnReason("");
    setReturnComment("");
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    if (!returnReason.trim()) {
      alert("Please select or write a reason.");
      return;
    }

    try {
      setSubmittingReturn(true);
      setError("");

      const res = await fetch(
        `${BACKEND_URL}/api/orders/${selectedOrder._id}/return`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            reason: returnReason,
            comment: returnComment,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Return request error:", data);
        setError(data.error || "Failed to submit return request");
        return;
      }

      // Update that order in state
      setOrders((prev) =>
        prev.map((o) => (o._id === data.order._id ? data.order : o))
      );

      closeReturnModal();
    } catch (err) {
      console.error("Return submit error:", err);
      setError("Failed to submit return request. Please try again.");
    } finally {
      setSubmittingReturn(false);
    }
  };

  // ----------------- Render -----------------

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin border-4 border-gray-300 border-t-green-600 rounded-full" />
      </div>
    );
  }

  if (!orders.length && !error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">My Orders</h1>
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
    );
  }
const hasUserReviewedProduct = (product, reviews = []) => {
  if (!user || !reviews.length) return false;
  return reviews.some(
    (r) => String(r.user_id) === String(user._id)
  );
};

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track, manage and return your recent orders.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const orderReturnInfo = getReturnInfoText(order);
          const returnBadge = getReturnBadge(order);

          return (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-5 flex flex-col gap-3"
            >
              {/* Top row: ID, date, status, total */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID:{" "}
                    <span className="font-mono font-medium text-gray-700">
                      {order._id}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on: {formatDateTime(order.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Payment:{" "}
                    <span className="font-medium">
                      {order.paymentMethod}
                    </span>
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
                    {returnBadge}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">
                    Order total
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {currency(order.total)}
                  </p>
                  <span
                    className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      order.orderStatus === "delivered"
                        ? "bg-green-50 text-green-700"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-50 text-red-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {order.orderStatus?.replace(/_/g, " ") || "processing"}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="border-t border-dashed mt-3 pt-3 text-sm flex flex-col gap-3">
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
                    <button
                      onClick={() => navigate("/product")}
                      className="px-3 py-1.5 text-xs md:text-sm border rounded-lg hover:bg-gray-50"
                    >
                      Buy Again
                    </button>
                    {isReturnEligible(order) && (
                      <button
                        onClick={() => openReturnModal(order)}
                        className="px-3 py-1.5 text-xs md:text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        Request Return
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional extra info about return / return status */}
                {orderReturnInfo && (
                  <p className="text-xs text-gray-600 mt-1">
                    {orderReturnInfo}
                  </p>
                )}

                {/* Quick items preview */}
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
      <p className="text-xs text-gray-600">
        Qty: {item.quantity} • Price: {currency(item.price)}
      </p>

      {/* ✅ ADD REVIEW BUTTON */}
      {order.orderStatus === "delivered" && (
        <button
          onClick={() =>
            navigate(`/product/${item.product}#reviews`)
          }
          className="mt-1 inline-flex items-center text-xs font-semibold text-green-600 hover:underline"
        >
          ⭐ Add Review
        </button>
      )}
    </div>
  </div>
))}

                    </div>
                    {order.items.length > 3 && (
                      <div className="text-xs text-gray-500">
                        + {order.items.length - 3} more item
                        {order.items.length - 3 > 1 ? "s" : ""} in this
                        order
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------- RETURN MODAL ------------- */}
      {showReturnModal && selectedOrder && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                Request Return – #{selectedOrder._id}
              </h2>
              <button
                onClick={closeReturnModal}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Please tell us why you want to return this order. Our team
              will review your request.
            </p>

            <form onSubmit={handleSubmitReturn} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Reason for return <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="Size / fit issue">Size / fit issue</option>
                  <option value="Received damaged product">
                    Received damaged product
                  </option>
                  <option value="Item not as described">
                    Item not as described
                  </option>
                  <option value="Wrong item received">
                    Wrong item received
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Additional details (optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Share any extra details that may help us process your return faster."
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeReturnModal}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                  disabled={submittingReturn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReturn}
                  className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
                >
                  {submittingReturn ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}