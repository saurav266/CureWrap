import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlus,
  FaTags,
  FaUsers,
  FaCog,
} from "react-icons/fa";

const items = [
  { to: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/admin/products", label: "Products", icon: <FaBoxOpen /> },
  { to: "/admin/add-product", label: "Add Product", icon: <FaPlus /> },
  { to: "/admin/categories", label: "Categories", icon: <FaTags /> },
  { to: "/admin/users", label: "Users", icon: <FaUsers /> },
  { to: "/admin/settings", label: "Settings", icon: <FaCog /> },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <aside
      className={`transition-all duration-300 bg-slate-900 border-r border-slate-800 p-4 h-screen fixed top-0 left-0 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className={`text-xl font-bold text-white ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          CyberShield
        </h1>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-300 hover:text-white"
        >
          {sidebarOpen ? "<" : ">"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 ${
                isActive ? "bg-slate-800/40 ring-1 ring-slate-700" : ""
              }`
            }
          >
            <span className="w-6 text-slate-300 text-center">{item.icon}</span>

            {sidebarOpen && (
              <span className="text-sm text-slate-200">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="mt-6 text-slate-500 text-xs">© 2025 CyberShield</div>
      )}
    </aside>
  );
}
