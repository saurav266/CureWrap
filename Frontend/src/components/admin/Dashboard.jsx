import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FiMenu, FiBell, FiSearch, FiUser, FiBox, FiHome, FiUsers } from "react-icons/fi";

const revenueData = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 4200 },
  { month: "Mar", revenue: 3800 },
  { month: "Apr", revenue: 5200 },
  { month: "May", revenue: 6300 },
  { month: "Jun", revenue: 7100 },
];

const ordersData = [
  { day: "Mon", orders: 30 },
  { day: "Tue", orders: 70 },
  { day: "Wed", orders: 50 },
  { day: "Thu", orders: 90 },
  { day: "Fri", orders: 110 },
  { day: "Sat", orders: 130 },
];

const StatCard = ({ title, value, delta, icon }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
    <div className="flex-1">
      <p className="text-sm text-slate-300">{title}</p>
      <h2 className="text-2xl font-semibold mt-1">{value}</h2>
      {delta && (
        <p
          className={`text-xs mt-1 ${
            delta.startsWith("+") ? "text-green-400" : "text-red-400"
          }`}
        >
          {delta} vs last month
        </p>
      )}
    </div>
    <div className="w-12 h-12 rounded-lg bg-slate-700/40 flex items-center justify-center border border-slate-600">
      {icon}
    </div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="p-6 text-white">

      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              className="bg-slate-800 px-3 py-2 rounded-lg w-60 outline-none"
              placeholder="Search..."
            />
            <FiSearch className="absolute right-3 top-2.5 text-slate-400" />
          </div>

          <FiBell className="text-xl cursor-pointer" />
          <FiUser className="text-xl cursor-pointer" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Revenue" value="$72,430" delta="+12%" icon={<FiHome />} />
        <StatCard title="Orders" value="1,420" delta="-2%" icon={<FiBox />} />
        <StatCard title="Active Users" value="9,832" delta="+8%" icon={<FiUsers />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-800/40 p-5 rounded-2xl border border-slate-700">
          <h2 className="text-lg font-medium mb-3">Revenue Overview</h2>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  dataKey="revenue"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700">
          <h2 className="text-lg font-medium mb-3">Orders This Week</h2>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Bar dataKey="orders" barSize={20} fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
