import React, { useEffect, useState } from "react";

/*
UserDetails.jsx
Admin can view full info about a user:
- Profile info (name, email, phone, role, status, last login)
- Order history
- Login activity
- Tracking info per order
Backend endpoints expected:
GET /api/admin/users/:id
GET /api/admin/users/:id/orders
GET /api/admin/users/:id/logins
*/

export default function UserDetails({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    loadAll();
  }, [userId]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [uRes, oRes, lRes] = await Promise.all([
        fetch(`/api/admin/users/${userId}`),
        fetch(`/api/admin/users/${userId}/orders`),
        fetch(`/api/admin/users/${userId}/logins`),
      ]);

      if (!uRes.ok) throw new Error("Failed loading user");

      const u = await uRes.json();
      const o = await oRes.json();
      const l = await lRes.json();

      setUser(u);
      setOrders(o.data || []);
      setLogins(l.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!userId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">User Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">Close</button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            {/* HEADER SECTION */}
            <div className="bg-gray-50 p-4 rounded border mb-6">
              <h3 className="text-xl font-semibold mb-2">Profile Overview</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Name:</span> {user.name}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Mobile:</span> {user.phone || "N/A"}</p>
                </div>
                <div>
                  <p><span className="font-medium">Role:</span> {user.role}</p>
                  <p><span className="font-medium">Status:</span> {user.status}</p>
                  <p><span className="font-medium">Last Login:</span> {user.lastLogin || "—"}</p>
                </div>
              </div>
            </div>

            {/* ORDER HISTORY */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Order History</h3>
              <div className="overflow-x-auto bg-white rounded border">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4">Order ID</th>
                      <th className="py-2 px-4">Amount</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Tracking ID</th>
                      <th className="py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-gray-500 text-center">No orders found</td></tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-4">{o.id}</td>
                          <td className="py-2 px-4">₹{o.amount}</td>
                          <td className="py-2 px-4">{o.status}</td>
                          <td className="py-2 px-4">{o.trackingId || "—"}</td>
                          <td className="py-2 px-4">{o.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LOGIN HISTORY */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Recent Login Activity</h3>
              <div className="bg-white rounded border overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">IP Address</th>
                      <th className="py-2 px-4">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logins.length === 0 ? (
                      <tr><td colSpan={3} className="p-4 text-center text-gray-500">No login records</td></tr>
                    ) : (
                      logins.map((l, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-4">{l.date}</td>
                          <td className="py-2 px-4">{l.ip || "—"}</td>
                          <td className="py-2 px-4">{l.device || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}