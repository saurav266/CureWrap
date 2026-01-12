// src/components/admin/order/AllOrder.jsx
import React, { useEffect, useMemo, useState } from "react";

const BACKEND_URL = ""; // Adjust as needed

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "processing", label: "Processing" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentStatusOptions = [
  { value: "all", label: "All payments" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
  { value: "failed", label: "Failed" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amountHigh", label: "Amount: High → Low" },
  { value: "amountLow", label: "Amount: Low → High" },
];

const quickFilters = [
  { value: "all", label: "All Orders" },
  { value: "prepaid", label: "Prepaid (Razorpay)" },
  { value: "cod", label: "Cash on Delivery" },
  { value: "cancelled", label: "Cancelled" },
];

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function currency(n = 0) {
  return `₹${Number(n || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default function AllOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Edit mode (inside modal)
  const [isEditMode, setIsEditMode] = useState(false);
  const [editShipping, setEditShipping] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // filters + sorting
  const [quickFilter, setQuickFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ---------- Load orders from backend ----------
  const loadOrders = async () => {
    try {
      setLoading(true);
      setLoadError("");

      // uses router.get("/admin/all", getAllOrders)
      const res = await fetch(`${BACKEND_URL}/api/orders/admin/all`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load orders");
      }

      const list = Array.isArray(data.orders) ? data.orders : [];
      setOrders(list);
    } catch (err) {
      console.error("loadOrders error:", err);
      setLoadError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ---------- Derived filtered + sorted list ----------
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    // QUICK FILTERS
    if (quickFilter === "cancelled") {
      list = list.filter((o) => o.orderStatus === "cancelled");
    } else if (quickFilter === "prepaid") {
      list = list.filter(
        (o) => o.paymentMethod === "RAZORPAY" && o.paymentStatus === "paid"
      );
    } else if (quickFilter === "cod") {
      list = list.filter((o) => o.paymentMethod === "COD");
    }

    // STATUS FILTER
    if (statusFilter !== "all") {
      list = list.filter((o) => o.orderStatus === statusFilter);
    }

    // PAYMENT FILTER
    if (paymentFilter !== "all") {
      list = list.filter((o) => o.paymentStatus === paymentFilter);
    }

    // SORTING
    list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "amountHigh") {
        return (b.total || 0) - (a.total || 0);
      }
      if (sortBy === "amountLow") {
        return (a.total || 0) - (b.total || 0);
      }
      return 0;
    });

    return list;
  }, [orders, quickFilter, statusFilter, paymentFilter, sortBy]);

  // ---------- Actions ----------
  const openOrder = (o) => {
    setSelectedOrder(o);
    setIsEditMode(false);
    setEditShipping(o.shippingAddress || {});
  };

  const closeOrder = () => {
    setSelectedOrder(null);
    setIsEditMode(false);
    setEditShipping(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return;
    setUpdating(true);
    try {
      // router.put("/admin/:id/status", updateOrderStatus);
      const res = await fetch(
        `${BACKEND_URL}/api/orders/admin/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status");
      }

      const updated = data.order;
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
      if (selectedOrder && selectedOrder._id === updated._id) {
        setSelectedOrder(updated);
        setEditShipping(updated.shippingAddress || {});
      }
    } catch (err) {
      console.error("handleStatusChange error:", err);
      alert(err.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkPaid = async (orderId) => {
    if (!window.confirm("Mark this COD order as paid?")) return;
    setUpdating(true);
    try {
      // router.put("/:id/mark-paid", markOrderPaid);
      const res = await fetch(
        `${BACKEND_URL}/api/orders/${orderId}/mark-paid`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to mark order as paid");
      }
      const updated = data.order;
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
      if (selectedOrder && selectedOrder._id === updated._id) {
        setSelectedOrder(updated);
        setEditShipping(updated.shippingAddress || {});
      }
    } catch (err) {
      console.error("handleMarkPaid error:", err);
      alert(err.message || "Failed to mark order as paid");
    } finally {
      setUpdating(false);
    }
  };

  // ---------- Save edited shipping ----------
  const handleSaveEdit = async () => {
    if (!selectedOrder || !editShipping) return;
    setSavingEdit(true);
    try {
      // router.put("/admin/:id/edit", editOrder);
      const res = await fetch(
        `${BACKEND_URL}/api/orders/admin/${selectedOrder._id}/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shippingAddress: editShipping }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to edit order");
      }

      const updated = data.order;
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
      setSelectedOrder(updated);
      setEditShipping(updated.shippingAddress || {});
      setIsEditMode(false);
    } catch (err) {
      console.error("handleSaveEdit error:", err);
      alert(err.message || "Failed to save changes");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleShippingChange = (field, value) => {
    setEditShipping((prev) => ({
      ...(prev || {}),
      [field]: value,
    }));
  };

  // ---------- Render ----------
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage all customer orders, update status, edit address, and see
            prepaid & COD orders.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Filters & Sorting */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        {/* Quick filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickFilters.map((q) => (
            <button
              key={q.value}
              onClick={() => setQuickFilter(q.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
                quickFilter === q.value
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Status filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Order status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment status filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Payment status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              {paymentStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort select */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Sort by
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100/80 border-b border-gray-200">
            <tr className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Placed</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Loading orders…
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-red-600"
                >
                  {loadError}
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No orders found with current filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const customerName =
                  o.shippingAddress?.name || "Customer";
                const isPrepaid =
                  o.paymentMethod === "RAZORPAY" &&
                  o.paymentStatus === "paid";

                return (
                  <tr
                    key={o._id}
                    className="border-t border-gray-100 hover:bg-gray-50/80 cursor-pointer transition"
                    onClick={() => openOrder(o)}
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-gray-900 truncate max-w-[150px]">
                          {o._id}
                        </span>
                        {o.returnStatus && o.returnStatus !== "none" && (
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                            Return: {o.returnStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {customerName}
                        </span>
                        {o.shippingAddress?.phone && (
                          <span className="text-xs text-gray-500">
                            📞 {o.shippingAddress.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {currency(o.total)}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Subtotal: {currency(o.subtotal)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-800">
                          {o.paymentMethod || "—"}
                        </span>
                        <span
                          className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            o.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : o.paymentStatus === "refunded"
                              ? "bg-blue-100 text-blue-700"
                              : o.paymentStatus === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {o.paymentStatus || "pending"}
                        </span>
                        {isPrepaid && (
                          <span className="text-[10px] text-green-700 font-medium">
                            Prepaid
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="text-xs font-medium capitalize text-gray-800">
                        {(o.orderStatus || "processing").replace(
                          /_/g,
                          " "
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="text-xs text-gray-600">
                        {formatDate(o.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="text-xs font-semibold text-green-700 underline">
                        Manage
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- ORDER DETAILS MODAL ---------- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Order ID:{" "}
                  <span className="font-mono">
                    {selectedOrder._id}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Placed: {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditMode((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    isEditMode
                      ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {isEditMode ? "Cancel Edit" : "Edit Address"}
                </button>
                <button
                  onClick={closeOrder}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Top summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Customer */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  Customer
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedOrder.shippingAddress?.name || "Customer"}
                </p>
                {selectedOrder.shippingAddress?.phone && (
                  <p className="text-xs text-gray-600 mt-1">
                    📞 {selectedOrder.shippingAddress.phone}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.state}
                </p>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  Payment
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedOrder.paymentMethod}
                </p>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      selectedOrder.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : selectedOrder.paymentStatus === "refunded"
                        ? "bg-blue-100 text-blue-700"
                        : selectedOrder.paymentStatus === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Total:{" "}
                  <span className="font-semibold">
                    {currency(selectedOrder.total)}
                  </span>
                </p>
                {selectedOrder.refundInfo && (
                  <p className="text-[11px] text-blue-700 mt-1">
                    Refund: {selectedOrder.refundInfo.status}{" "}
                    {selectedOrder.refundInfo.amount &&
                      `(${currency(
                        selectedOrder.refundInfo.amount
                      )})`}
                  </p>
                )}
              </div>

              {/* Status + mark paid */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  Order Status
                </p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {(selectedOrder.orderStatus || "processing").replace(
                    /_/g,
                    " "
                  )}
                </p>

                <label className="block text-[11px] text-gray-500 mt-3 mb-1">
                  Update status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                  defaultValue={selectedOrder.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder._id,
                      e.target.value
                    )
                  }
                  disabled={updating}
                >
                  {statusOptions
                    .filter((opt) => opt.value !== "all")
                    .map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </select>

                {selectedOrder.paymentMethod === "COD" &&
                  selectedOrder.paymentStatus !== "paid" && (
                    <button
                      onClick={() =>
                        handleMarkPaid(selectedOrder._id)
                      }
                      disabled={updating}
                      className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      Mark COD as Paid
                    </button>
                  )}
              </div>
            </div>

            {/* Shipping & tracking */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Shipping (with edit mode) */}
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Shipping Address
                </p>

                {!isEditMode && (
                  <>
                    <p className="text-xs text-gray-700">
                      {selectedOrder.shippingAddress?.name}
                    </p>
                    <p className="text-xs text-gray-700">
                      {selectedOrder.shippingAddress?.addressLine1}
                    </p>
                    {selectedOrder.shippingAddress?.addressLine2 && (
                      <p className="text-xs text-gray-700">
                        {selectedOrder.shippingAddress?.addressLine2}
                      </p>
                    )}
                    <p className="text-xs text-gray-700">
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state}{" "}
                      {selectedOrder.shippingAddress?.postalCode}
                    </p>
                    <p className="text-xs text-gray-700">
                      {selectedOrder.shippingAddress?.country}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      📞 {selectedOrder.shippingAddress?.phone}
                    </p>
                  </>
                )}

                {isEditMode && editShipping && (
                  <div className="space-y-2 mt-1">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                      placeholder="Full name"
                      value={editShipping.name || ""}
                      onChange={(e) =>
                        handleShippingChange("name", e.target.value)
                      }
                    />
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                      placeholder="Phone"
                      value={editShipping.phone || ""}
                      onChange={(e) =>
                        handleShippingChange("phone", e.target.value)
                      }
                    />
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                      placeholder="Address line 1"
                      value={editShipping.addressLine1 || ""}
                      onChange={(e) =>
                        handleShippingChange(
                          "addressLine1",
                          e.target.value
                        )
                      }
                    />
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                      placeholder="Address line 2"
                      value={editShipping.addressLine2 || ""}
                      onChange={(e) =>
                        handleShippingChange(
                          "addressLine2",
                          e.target.value
                        )
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                        placeholder="City"
                        value={editShipping.city || ""}
                        onChange={(e) =>
                          handleShippingChange("city", e.target.value)
                        }
                      />
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                        placeholder="State"
                        value={editShipping.state || ""}
                        onChange={(e) =>
                          handleShippingChange("state", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                        placeholder="Pincode"
                        value={editShipping.postalCode || ""}
                        onChange={(e) =>
                          handleShippingChange(
                            "postalCode",
                            e.target.value
                          )
                        }
                      />
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                        placeholder="Country"
                        value={editShipping.country || ""}
                        onChange={(e) =>
                          handleShippingChange(
                            "country",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <button
                      onClick={handleSaveEdit}
                      disabled={savingEdit}
                      className="mt-2 w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {savingEdit ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                )}
              </div>

              {/* Shiprocket tracking */}
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Shipment / Tracking
                </p>
                {selectedOrder.shiprocket?.awb_code ? (
                  <>
                    <p className="text-xs text-gray-700">
                      <span className="font-semibold">AWB:</span>{" "}
                      {selectedOrder.shiprocket.awb_code}
                    </p>
                    <p className="text-xs text-gray-700 mb-2">
                      <span className="font-semibold">
                        Courier:
                      </span>{" "}
                      {selectedOrder.shiprocket.courier_name || "N/A"}
                    </p>
                    {/* DOWNLOAD LABEL BUTTON */}
                      {/* TRACK ON SHIPROCKET */}
                      <button
                        className="mt-1 px-3 py-1.5 text-xs rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
                        onClick={() =>
                          window.open(
                            `https://shiprocket.co/tracking/${selectedOrder.shiprocket.awb_code}`,
                            "_blank"
                          )
                        }
                      >
                        Track on Shiprocket
                      </button>

                      {/* LIVE TRACKING (BACKEND API) */}
                      <button
                        className="mt-2 px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        onClick={() =>
                          window.open(
                            `${BACKEND_URL}/api/orders/track/${selectedOrder.shiprocket.awb_code}`,
                            "_blank"
                          )
                        }
                      >
                        Live Tracking (API)
                      </button>

                      {/* DOWNLOAD SHIPPING LABEL */}
                      {selectedOrder.shiprocket?.label_url && (
                        <button
                          className="mt-2 px-3 py-1.5 text-xs rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700"
                          onClick={() =>
                            window.open(selectedOrder.shiprocket.label_url, "_blank")
                          }
                        >
                          Download Shipping Label
                        </button>
                      )}

                  </>
                ) : (
                  <p className="text-xs text-gray-500">
                    Shipment not yet assigned to courier.
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Items ({selectedOrder.items?.length || 0})
              </p>
              {selectedOrder.items?.length ? (
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity}
                          {item.size && <> • Size: {item.size}</>}
                          {item.color && <> • Colour: {item.color}</>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {currency(item.price)}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {currency(
                            (item.price || 0) * (item.quantity || 1)
                          )}{" "}
                          total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  No items found in this order.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
