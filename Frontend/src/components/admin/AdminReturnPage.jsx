// src/pages/admin/ReturnsManagement.jsx
import React, { useEffect, useState } from "react";

const BACKEND_URL = "";

const statusColors = {
  requested: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const typeColors = {
  refund: "bg-blue-50 text-blue-700",
  replacement: "bg-purple-50 text-purple-700",
};

export default function ReturnsManagement() {
  const [orders, setOrders] = useState([]);          // orders with returnStatus != "none"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ---------- Helpers ----------
  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN") : "N/A";

  const currency = (n = 0) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const loadReturns = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}/api/orders/admin/returns`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to load return orders");
        setOrders([]);
        return;
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("loadReturns error:", err);
      setError("Failed to load return orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    const note =
      status === "rejected"
        ? window.prompt("Reason for rejection?", "") || ""
        : status === "approved"
        ? window.prompt("Any note for approval? (optional)", "") || ""
        : "";

    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/api/orders/admin/${orderId}/return-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status, note }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error("updateReturnStatus error:", data);
        alert(data.error || "Failed to update return status");
        return;
      }

      // Refresh list
      await loadReturns();
    } catch (err) {
      console.error("handleUpdateStatus error:", err);
      alert("Failed to update return status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Return / Replacement Requests</h1>
        <button
          onClick={loadReturns}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin border-4 border-gray-300 border-t-green-600 rounded-full" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No return/replacement requests yet.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600 bg-gray-50">
                <th className="py-2 px-3 text-left">Order ID</th>
                <th className="py-2 px-3 text-left">Customer</th>
                <th className="py-2 px-3 text-left">Type</th>
                <th className="py-2 px-3 text-left">Reason</th>
                <th className="py-2 px-3 text-left">Amount / Refund</th>
                <th className="py-2 px-3 text-left">Return Status</th>
                <th className="py-2 px-3 text-left">Order Status</th>
                <th className="py-2 px-3 text-left">Requested At</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isRequested = order.returnStatus === "requested";
                const refundAmount =
                  order.refundInfo?.amount ?? order.total ?? 0;
                const refundStatus = order.refundInfo?.status;

                return (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 align-top"
                  >
                    <td className="py-2 px-3 font-mono text-xs">
                      {order._id}
                    </td>

                    <td className="py-2 px-3">
                      <div className="font-medium">
                        {order.shippingAddress?.name || "Customer"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress?.phone}
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      {order.returnType ? (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                            typeColors[order.returnType] ||
                            "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {order.returnType}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>

                    <td className="py-2 px-3 max-w-xs">
                      <div
                        className="text-xs text-gray-800 line-clamp-3"
                        title={order.returnReason}
                      >
                        {order.returnReason || "-"}
                      </div>
                      {order.returnAdminNote && (
                        <div className="mt-1 text-[11px] text-gray-500">
                          Admin note: {order.returnAdminNote}
                        </div>
                      )}
                    </td>

                    <td className="py-2 px-3">
                      <div className="text-xs">
                        <div className="font-semibold">
                          {currency(refundAmount)}
                        </div>
                        {refundStatus && (
                          <div className="text-[11px] text-gray-500">
                            Refund status: {refundStatus}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          statusColors[order.returnStatus] ||
                          "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {order.returnStatus || "none"}
                      </span>
                    </td>

                    <td className="py-2 px-3 text-xs capitalize">
                      {order.orderStatus || "-"}
                    </td>

                    <td className="py-2 px-3 text-xs text-gray-500">
                      {formatDate(order.returnRequestedAt || order.updatedAt)}
                    </td>

                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={updatingId === order._id || !isRequested}
                          onClick={() =>
                            handleUpdateStatus(order._id, "approved")
                          }
                          className="px-2 py-1 rounded bg-green-600 text-white text-xs disabled:opacity-50"
                        >
                          {updatingId === order._id && isRequested
                            ? "Saving..."
                            : "Approve"}
                        </button>

                        <button
                          disabled={updatingId === order._id || !isRequested}
                          onClick={() =>
                            handleUpdateStatus(order._id, "rejected")
                          }
                          className="px-2 py-1 rounded bg-red-600 text-white text-xs disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
