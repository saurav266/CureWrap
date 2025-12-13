// src/pages/AdminPages/User.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = ""; // change if needed

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all users once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        console.log("STATUS:", res.status);
        const data = await res.json().catch(() => ({}));
        console.log("RESPONSE BODY:", data);

        if (!res.ok) {
          throw new Error(data.message || `Failed with status ${res.status}`);
        }

        setUsers(data);
        setDisplayedUsers(data);
      } catch (err) {
        console.error("FETCH USERS ERROR:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // Handle search
  const handleSearch = (e) => {
    e && e.preventDefault();

    const q = search.trim().toLowerCase();

    if (!q) {
      setDisplayedUsers(users);
      return;
    }

    const filtered = users.filter((u) => {
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phoneno?.toLowerCase().includes(q) ||
        (u._id && u._id.toLowerCase().includes(q))
      );
    });

    setDisplayedUsers(filtered);
  };

  const handleClearSearch = () => {
    setSearch("");
    setDisplayedUsers(users);
  };

  const removeUserFromState = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
    setDisplayedUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const updateUserInState = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
    setDisplayedUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    const targetUser = users.find((u) => u._id === userId);

    if (targetUser?.isAdmin) {
      alert("You cannot delete the admin account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setActionLoadingId(userId);
      setError("");

      const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      removeUserFromState(userId);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ---------- EDIT LOGIC ----------

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPhone(user.phoneno || "");
    setIsEditOpen(true);
    setError("");
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
    setEditPhone("");
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setActionLoadingId(editingUser._id);
      setError("");

      const res = await fetch(
        `${BACKEND_URL}/api/admin/users/${editingUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            name: editName,
            email: editEmail,
            phoneno: editPhone,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      updateUserInState(data);
      closeEditModal();
    } catch (err) {
      console.error("UPDATE USER ERROR:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ----------------------------

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              All Users
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View, search, and manage registered users.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
          >
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-100"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="py-10 text-center text-slate-500">
            Loading users...
          </div>
        )}

        {error && !loading && (
          <div className="py-3 px-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && displayedUsers.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No users found.
          </div>
        )}

        {!loading && !error && displayedUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user, index) => {
                  const isBusy = actionLoadingId === user._id;
                  const isAdminUser = user.isAdmin;

                  return (
                    <tr
                      key={user._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-slate-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {user.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {user.phoneno || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            isAdminUser
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-50 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {isAdminUser ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                        {user._id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => navigate(`/admin/users/${user._id}/details`)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            disabled={isBusy}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-400 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={isBusy || isAdminUser}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {isAdminUser ? "Protected" : "Delete"}
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

      {/* EDIT MODAL (same as before) */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Edit User
            </h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId === editingUser?._id}
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
                >
                  {actionLoadingId === editingUser?._id
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
