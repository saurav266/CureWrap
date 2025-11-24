    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/authContext';

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
        <div className="w-full min-h-screen p-8 bg-gradient-to-br from-white to-blue-50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-blue-800 flex items-center gap-2">
                    <span>👤</span> My Profile
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/profile/edit')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Back
                    </button>
                </div>
            </div>

        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4 text-gray-800 text-lg">
            <li className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">Name:</span> {user.name}
            </li>
            <li className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">Email:</span> {user.email}
            </li>
                    <li className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">Phone:</span> {user.phone || 'N/A'}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">Gender:</span> {user.gender || 'N/A'}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">Address:</span> {user.address || 'N/A'}
                    </li>
            {user.role && (
            <li className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">Role:</span> {user.role}
            </li>
            )}
            {user.class && (
            <li className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">Class:</span> {user.class}
            </li>
            )}
        </ul>
        </div>
    </div>


    );
    };

    export default Profile;
