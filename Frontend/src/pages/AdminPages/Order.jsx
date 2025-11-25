import React, { useEffect, useState } from "react";

/*
OrderManagement.jsx
Admin can:
- View all orders
- Update order status
- Update payment status
- View tracking info
Backend endpoints expected:
GET    /api/admin/orders
PUT    /api/admin/orders/:id/status        { status }
PUT    /api/admin/orders/:id/payment       { paymentStatus }
PUT    /api/admin/orders/:id/tracking      { trackingId, courier }
*/

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openOrder(order) {
    setSelectedOrder(order);
  }

  function closeOrder() {
    setSelectedOrder(null);
  }

  async function updateOrderStatus(id, status) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      loadOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  }

  async function updatePaymentStatus(id, paymentStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (!res.ok) throw new Error("Payment update failed");
      loadOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  }

  async function updateTracking(id, trackingId, courier) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/tracking`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId, courier }),
      });
      if (!res.ok) throw new Error("Tracking update failed");
      loadOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <button className="px-4 py-2 bg-white border rounded shadow" onClick={loadOrders}>Refresh</button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="p-6 text-red-500 text-center">{error}</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">No orders</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => openOrder(o)}>
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{o.userName}</td>
                  <td className="p-3">₹{o.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-sm rounded ${
                      o.paymentStatus === "Paid" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">{o.date}</td>
                  <td className="p-3 text-blue-600 underline">Manage</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button onClick={closeOrder} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            {/* DETAILS */}
            <div className="bg-gray-50 p-4 rounded border mb-6">
              <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
              <p><span className="font-medium">User:</span> {selectedOrder.userName}</p>
              <p><span className="font-medium">Amount:</span> ₹{selectedOrder.amount}</p>
              <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod || "—"}</p>
              <p><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus}</p>
            </div>

            {/* UPDATE PAYMENT STATUS */}
            <div className="mb-4">
              <label className="font-medium block mb-1">Update Payment Status</label>
              <select
                className="border px-3 py-2 rounded"
                onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                defaultValue={selectedOrder.paymentStatus}
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            {/* UPDATE ORDER STATUS */}
            <div className="mb-4">
              <label className="font-medium block mb-1">Update Order Status</label>
              <select
                className="border px-3 py-2 rounded"
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                defaultValue={selectedOrder.status}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* TRACKING UPDATE */}
            <div className="mb-4 bg-gray-50 p-4 rounded border">
              <h4 className="font-semibold mb-2">Tracking Information</h4>
              <label className="block mb-1 text-sm">Tracking ID</label>
              <input
                type="text"
                defaultValue={selectedOrder.trackingId || ""}
                id="trackId"
                className="border px-3 py-2 rounded w-full mb-3"
              />

              <label className="block mb-1 text-sm">Courier Partner</label>
              <input
                type="text"
                defaultValue={selectedOrder.courier || ""}
                id="courierId"
                className="border px-3 py-2 rounded w-full mb-3"
              />

              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => updateTracking(selectedOrder.id, document.getElementById("trackId").value, document.getElementById("courierId").value)}
              >
                Update Tracking
              </button>
            </div>
          </div>
        </div>

        )}
    </div>
    );
    }
    
      
