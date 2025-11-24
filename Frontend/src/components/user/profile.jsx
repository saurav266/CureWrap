import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-700">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-linear-to-br from-white to-blue-50 shadow-xl rounded-xl mt-12 transition-all duration-300">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4 text-gray-800 text-lg">
          <li className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">Name:</span>{" "}
            {user.name}
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">Email:</span>{" "}
            {user.email}
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">Phone:</span>{" "}
            {user.phone || "N/A"}
          </li>

          {user.class && (
            <li className="flex items-center gap-2">
              <span className="font-semibold text-blue-600">Class:</span>{" "}
              {user.class}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
