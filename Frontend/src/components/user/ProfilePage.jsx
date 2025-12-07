import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    phoneno: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Fetch profile on page load
 const getProfile = async () => {
  try {
    const userId = localStorage.getItem("userId");
    console.log("FETCH PROFILE USING USER ID:", userId);

    const res = await axios.get(
      `http://localhost:8000/api/users/profile?userId=${userId}`
    );

    if (res.data.success) {
      setProfile({
        name: res.data.user.name,
        phoneno: res.data.user.phoneno,
        email: res.data.user.email,
      });
    }
  } catch (error) {
    console.error("Profile load error:", error);
  }
};
    useEffect(() => {
      getProfile();
    }, []);

  // Save updated profile
  const saveProfile = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:8000/api/users/profile",
        {
          name: profile.name,
          phoneno: profile.phoneno,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setEditing(false);
      }
    } catch (err) {
      console.error("Profile update error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Profile
      </h2>

      {/* NAME */}
      <label className="block mb-3">
        <span className="text-gray-700 font-medium">Full Name</span>
        <input
          type="text"
          disabled={!editing}
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className={`mt-1 w-full px-3 py-2 border rounded-lg ${
            !editing ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </label>

      {/* PHONE */}
      <label className="block mb-3">
        <span className="text-gray-700 font-medium">Phone Number</span>
        <input
          type="text"
          disabled={!editing}
          value={profile.phoneno}
          onChange={(e) => setProfile({ ...profile, phoneno: e.target.value })}
          className={`mt-1 w-full px-3 py-2 border rounded-lg ${
            !editing ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </label>

      {/* EMAIL */}
      <label className="block mb-3">
        <span className="text-gray-700 font-medium">Email</span>
        <input
          type="email"
          disabled={true}
          value={profile.email}
          className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </label>

      <div className="flex justify-between mt-6">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={saveProfile}
              disabled={loading}
              className="px-5 py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
