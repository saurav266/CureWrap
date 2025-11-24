// src/pages/adminDashboard.jsx
import React from "react";
import AdminNavbar from "./AdminNavbar"; // ✅ rename import for clarity

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin-specific navbar */}
      <AdminNavbar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2">Welcome, Admin! 🎉</p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Users</h2>
            <p>Total: 120</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Orders</h2>
            <p>Total: 45</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Revenue</h2>
            <p>₹50,000</p>
          </div>
        </div>
      </main>
    </div>
  );
}