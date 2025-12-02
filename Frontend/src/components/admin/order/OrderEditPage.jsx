// src/pages/admin/OrderEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const BACKEND_URL = "http://localhost:8000";

export default function OrderEditPage() {
  const { id } = useParams(); // order id from route: /admin/orders/:id
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [error, setError] = useState("");

  // editable fields
  const [status, setStatus] = useState("processing");
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [contactPhone, setContactPhone] = useState("");

  // helper for auth header (if you store token)
  const getAuthHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (user.token) {
          headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        // ignore parse error
      }
    }
    return headers;
  };

  // ==================== Fetch order details ====================
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.order) {
        setError(data.error || "Failed to fetch order");
        setOrder(null);
        return;
      }

      const o = data.order;
      setOrder(o);

      // status
      setStatus(o.orderStatus || "processing");

      // shipping address
      const sa = o.shippingAddress || {};
      setShippingForm({
        fullName: sa.name || sa.fullName || "",
        phone: sa.phone || "",
        addressLine1: sa.addressLine1 || "",
        addressLine2: sa.addressLine2 || "",
        city: sa.city || "",
        state: sa.state || "",
        pincode: sa.postalCode || sa.pincode || "",
      });

      setContactPhone(o.contactPhone || sa.phone || "");
    } catch (err) {
      console.error("fetchOrder error:", err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ==================== Update order status ====================
  const handleStatusSave = async () => {
    if (!status) {
      return toast.error("Select a valid status");
    }

    try {
      setSavingStatus(true);
      const res = await fetch(
        `${BACKEND_URL}/api/orders/admin/${id}/status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.error || "Failed to update order status");
      }

      setOrder(data.order);
      toast.success("Order status updated");
    } catch (err) {
      console.error("handleStatusSave error:", err);
      toast.error("Error updating status");
    } finally {
      setSavingStatus(false);
    }
  };

  // ==================== Update shipping / contact ====================
  const handleContactSave = async () => {
    if (!shippingForm.fullName || !shippingForm.addressLine1) {
      return toast.error("Name and address line 1 are required");
    }
    if (!shippingForm.city || !shippingForm.pincode) {
      return toast.error("City and pincode are required");
    }

    try {
      setSavingContact(true);
      const res = await fetch(
        `${BACKEND_URL}/api/orders/admin/${id}/edit`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            shippingAddress: {
              name: shippingForm.fullName,
              phone: shippingForm.phone || contactPhone,
              addressLine1: shippingForm.addressLine1,
              addressLine2: shippingForm.addressLine2,
              city: shippingForm.city,
              state: shippingForm.state,
              postalCode: shippingForm.pincode,
              country: order?.shippingAddress?.country || "India",
            },
            contactPhone: contactPhone || shippingForm.phone,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        return toast.error(
          data.error || "Failed to update shipping/contact details"
        );
      }

      setOrder(data.order);
      toast.success("Contact details updated");
    } catch (err) {
      console.error("handleContactSave error:", err);
      toast.error("Error updating contact details");
    } finally {
      setSavingContact(false);
    }
  };

  // ==================== Render helpers ====================
  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN") : "N/A";

  const currency = (n = 0) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // ==================== UI ====================
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin border-4 border-gray-200 border-t-green-600 rounded-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-red-600 font-semibold mb-4">
          {error || "Order not found"}
        </p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-0 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Edit Order
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Order ID: <span className="font-mono">{order._id}</span>
          </p>
          <p className="text-xs text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/orders")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 text-sm hover:bg-gray-50"
        >
          ← Back to Orders
        </button>
      </div>

      {/* Main layout */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* LEFT: Order summary & items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order summary card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-semibold">
                  {order.shippingAddress?.name ||
                    shippingForm.fullName ||
                    "Guest"}
                </p>
                {order.userId && (
                  <p className="text-xs text-gray-500 mt-1">
                    User ID:{" "}
                    <span className="font-mono">
                      {String(order.userId).slice(0, 8)}...
                    </span>
                  </p>
                )}
              </div>

              <div>
                <p className="text-gray-500">Payment</p>
                <p className="font-semibold">
                  {order.paymentMethod || "N/A"}{" "}
                  <span
                    className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus || "pending"}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-gray-500">Order Status</p>
                <p className="font-semibold capitalize">
                  {order.orderStatus || "processing"}
                </p>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t mt-4 pt-4 grid md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Subtotal</p>
                <p className="font-semibold">{currency(order.subtotal)}</p>
              </div>
              <div>
                <p className="text-gray-500">Shipping</p>
                <p className="font-semibold">
                  {order.shippingCharges
                    ? currency(order.shippingCharges)
                    : "Free"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Tax</p>
                <p className="font-semibold">{currency(order.tax)}</p>
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-extrabold text-green-700">
                  {currency(order.total)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Items list */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Items ({order.items?.length || 0})
            </h2>

            {order.items?.length ? (
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg px-3 py-2 bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {item.name || "Product"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty:{" "}
                        <span className="font-medium">
                          {item.quantity}
                        </span>
                      </p>
                    </div>

                    <div className="text-right text-sm">
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
                No items in this order.
              </p>
            )}
          </motion.div>
        </div>

        {/* RIGHT: Status + shipping/contact edit + Shiprocket */}
        <div className="space-y-6">
          {/* Status card */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Update Order Status
            </h2>

            <label className="block text-sm text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={handleStatusSave}
              disabled={savingStatus}
              className="mt-4 w-full py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:bg-green-300"
            >
              {savingStatus ? "Saving..." : "Save Status"}
            </button>
          </motion.div>

          {/* Shipping & contact card */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping & Contact
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={shippingForm.fullName}
                  onChange={(e) =>
                    setShippingForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone (Shipping)
                </label>
                <input
                  type="text"
                  value={shippingForm.phone}
                  onChange={(e) =>
                    setShippingForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Contact Phone (override)
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="If different from shipping phone"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={shippingForm.addressLine1}
                  onChange={(e) =>
                    setShippingForm((prev) => ({
                      ...prev,
                      addressLine1: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={shippingForm.addressLine2}
                  onChange={(e) =>
                    setShippingForm((prev) => ({
                      ...prev,
                      addressLine2: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) =>
                      setShippingForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={shippingForm.state}
                    onChange={(e) =>
                      setShippingForm((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={shippingForm.pincode}
                  onChange={(e) =>
                    setShippingForm((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              onClick={handleContactSave}
              disabled={savingContact}
              className="mt-4 w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-300"
            >
              {savingContact ? "Saving..." : "Save Address & Contact"}
            </button>
          </motion.div>

          {/* Shiprocket Tracking Card */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipment & Tracking
            </h2>

            {order.shiprocket?.awb_code ? (
              <>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">AWB:</span>{" "}
                  {order.shiprocket.awb_code}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold">Courier:</span>{" "}
                  {order.shiprocket.courier_name || "N/A"}
                </p>

                <button
                  onClick={() =>
                    window.open(
                      `https://shiprocket.co/tracking/${order.shiprocket.awb_code}`,
                      "_blank"
                    )
                  }
                  className="w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
                >
                  Track Shipment
                </button>

                {order.shiprocket.label_url && (
                  <button
                    onClick={() =>
                      window.open(order.shiprocket.label_url, "_blank")
                    }
                    className="mt-3 w-full py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700"
                  >
                    Print Shipping Label
                  </button>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No AWB assigned yet. AWB will appear once courier is assigned.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
