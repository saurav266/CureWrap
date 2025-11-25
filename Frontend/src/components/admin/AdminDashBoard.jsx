import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res1 = await fetch("/api/admin/stats");
        const res2 = await fetch("/api/admin/recent-orders?limit=10");

        const statsJson = await res1.json();
        const ordersJson = await res2.json();

        setStats(statsJson);
        setRecentOrders(ordersJson.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const sortedOrders = [...recentOrders].sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    return 0;
  });


return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Users</h2>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Orders</h2>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Revenue</h2>
          <p className="text-3xl font-bold">₹{stats.revenue}</p>
        </div>
      </div>

      {/* Charts Section */
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* SALES LINE CHART */}
        <div className="bg-white p-6 rounded shadow h-72">
          <h2 className="text-lg font-semibold mb-3">📈 Sales Overview</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.sales || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* REVENUE BAR CHART */}
        <div className="bg-white p-6 rounded shadow h-72">
          <h2 className="text-lg font-semibold mb-3">💰 Revenue Chart</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.revenueGraph || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      /* Recent Orders */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>

          {/* Sort Dropdown */}
          <select
            className="border px-3 py-1 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        <table className="w-full text-left">
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
            {sortedOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{order.id}</td>
                <td>{order.customerName}</td>
                <td>₹{order.amount}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-50 text-green-600"
                        : order.status === "Pending"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="text-sm text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
