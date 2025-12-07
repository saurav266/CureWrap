// src/pages/admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = "http://localhost:8000";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    sales: [],
    revenueGraph: [],
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Load dashboard data (stats + recent orders)
  // --------------------------------------------------
  async function loadData() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch stats
      const res1 = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const statsJson = await res1.json();
      if (res1.ok) {
        setStats({
          usersCount: statsJson.usersCount || 0,
          ordersCount: statsJson.ordersCount || 0,
          totalRevenue: statsJson.totalRevenue || 0,
          sales: statsJson.sales || [],
          revenueGraph: statsJson.revenueGraph || [],
        });
      }

      // Fetch recent orders
      const res2 = await fetch(`${BACKEND_URL}/api/orders?limit=10`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const ordersJson = await res2.json();

      let orders = [];
      if (Array.isArray(ordersJson.orders)) orders = ordersJson.orders;
      else if (Array.isArray(ordersJson.data)) orders = ordersJson.data;
      else if (Array.isArray(ordersJson)) orders = ordersJson;

      setRecentOrders(orders);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Listen for new orders (WebSocket)
  // --------------------------------------------------
  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on("connect", () => {
      console.log("Admin WS Connected:", socket.id);
    });

    socket.on("new-order", (order) => {
      toast.success(`🆕 New Order Received: #${order._id} — ₹${order.total}`);

      // OPTIONAL: Play a notification sound
      new Audio("/new-order.mp3").play();

      // Add new order instantly to list
      setRecentOrders((prev) => [order, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  // --------------------------------------------------
  // Load data on mount
  // --------------------------------------------------
  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // UI helpers
  // --------------------------------------------------

  const nonCancelledOrders = recentOrders.filter(
    (o) => o.orderStatus !== "cancelled"
  );

  const sortedOrders = [...nonCancelledOrders].sort((a, b) => {
    if (sortBy === "amount") return (b.total || 0) - (a.total || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString() : "Not Available";

  const displayOrdersCount =
    nonCancelledOrders.length || stats.ordersCount || 0;

  // --------------------------------------------------
  // RENDER UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {loading && (
        <div className="mb-4 text-gray-500">Loading dashboard data...</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Users</h2>
          <p className="text-3xl font-bold">{stats.usersCount}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Orders</h2>
          <p className="text-3xl font-bold">{displayOrdersCount}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Revenue</h2>
          <p className="text-3xl font-bold">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Line Chart */}
        <div className="bg-white p-6 rounded shadow h-72">
          <h2 className="text-lg font-semibold mb-3">📈 Sales Overview</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 rounded shadow h-72">
          <h2 className="text-lg font-semibold mb-3">💰 Revenue Chart</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.revenueGraph}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>

          <select
            className="border px-3 py-1 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {sortedOrders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-4"
                >
                  No recent orders.
                </td>
              </tr>
            )}

            {sortedOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-2 font-mono text-xs">{order._id}</td>

                <td className="py-2">
                  {order.shippingAddress?.name || (
                    <span className="italic text-gray-400">Guest</span>
                  )}
                </td>

                <td className="py-2 font-semibold">
                  {order.paymentStatus === "paid" &&
                  order.orderStatus !== "cancelled"
                    ? `₹${order.total?.toLocaleString()}`
                    : "—"}
                </td>

                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize ${
                      order.orderStatus === "delivered"
                        ? "bg-green-50 text-green-600"
                        : order.orderStatus === "processing"
                        ? "bg-yellow-50 text-yellow-600"
                        : order.orderStatus === "shipped"
                        ? "bg-blue-50 text-blue-600"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td className="py-2 text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
