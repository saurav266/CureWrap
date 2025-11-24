import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-64"> {/* ml-64 equals sidebar width */}
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
