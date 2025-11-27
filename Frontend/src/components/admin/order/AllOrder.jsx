// src/pages/admin/AllOrder.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const BACKEND_URL = "http://localhost:8000";

// ⚠️ Adjust these endpoints to match your routes:
//  - GET   `${BACKEND_URL}/api/admin/orders`     -> return all orders
//  - PUT   `${BACKEND_URL}/api/admin/orders/:id` -> update orderStatus
// If you named them differently, just change inside fetchOrders() and updateStatus().

export default function AllOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null); // for details view
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        // If you use JWT for admin:
        // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch orders");
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update orderStatus (admin)
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const res = await fetch(
        `${BACKEND_URL}/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success("Order status updated");

      // Update UI without refetch
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="py-10 text-center text-gray-500">Loading orders...</div>
      )}

      {error && !loading && (
        <div className="mb-4 text-red-600 font-medium">{error}</div>
      )}

      {!loading && !orders.length && !error && (
        <div className="py-10 text-center text-gray-500">No orders found.</div>
      )}

      {/* Orders Table */}
      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-4 py-2 border-b">Order ID</th>
                <th className="px-4 py-2 border-b">User ID</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Items</th>
                <th className="px-4 py-2 border-b">Total</th>
                <th className="px-4 py-2 border-b">Payment</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b font-mono text-xs">
                    {o._id}
                  </td>
                  <td className="px-4 py-2 border-b text-xs text-gray-600">
                    {o.userId || <span className="italic text-gray-400">Guest</span>}
                  </td>
                  <td className="px-4 py-2 border-b text-xs">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {o.items?.length || 0}
                  </td>
                  <td className="px-4 py-2 border-b font-semibold">
                    ₹{(o.total ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">
                        {o.paymentMethod}
                      </span>
                      <span
                        className={`text-[11px] uppercase font-semibold ${
                          o.paymentStatus === "paid"
                            ? "text-green-600"
                            : o.paymentStatus === "failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={o.orderStatus || "processing"}
                      onChange={(e) =>
                        updateStatus(o._id, e.target.value)
                      }
                      disabled={updatingId === o._id}
                    >
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border-b text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4">
              Order Details - <span className="font-mono text-sm">{selectedOrder._id}</span>
            </h2>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <h3 className="font-semibold mb-1">General</h3>
                <p>
                  <span className="font-medium">User:</span>{" "}
                  {selectedOrder.userId || (
                    <span className="italic text-gray-500">Guest</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(selectedOrder.createdAt)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">
                    {selectedOrder.orderStatus}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Payment</h3>
                <p>
                  <span className="font-medium">Method:</span>{" "}
                  {selectedOrder.paymentMethod}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="uppercase">
                    {selectedOrder.paymentStatus}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Subtotal:</span>{" "}
                  ₹{(selectedOrder.subtotal ?? 0).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Shipping:</span>{" "}
                  ₹{(selectedOrder.shippingCharges ?? 0).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Tax:</span>{" "}
                  ₹{(selectedOrder.tax ?? 0).toLocaleString()}
                </p>
                <p className="font-semibold">
                  Total: ₹{(selectedOrder.total ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <div className="mb-4 text-sm">
                <h3 className="font-semibold mb-1">Shipping Address</h3>
                <div className="border rounded p-3 bg-gray-50">
                  <p className="font-medium">
                    {selectedOrder.shippingAddress.name}
                  </p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p>{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-left">Price</th>
                      <th className="px-3 py-2 text-left">Qty</th>
                      <th className="px-3 py-2 text-left">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-3 py-2 flex items-center gap-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded object-cover border"
                            />
                          )}
                          <span>{item.name}</span>
                        </td>
                        <td className="px-3 py-2">
                          ₹{(item.price ?? 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2">{item.quantity}</td>
                        <td className="px-3 py-2">
                          ₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
