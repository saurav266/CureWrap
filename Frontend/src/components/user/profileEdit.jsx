    import React, { useState } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/authContext';

    const ProfileEdit = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
            phone: user?.phone || '',
            class: user?.class || '',
            gender: user?.gender || '',
            address: user?.address || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
        const id = user?.id || user?._id;
        let res;

                if (user?.role === 'student') {
                    // include new fields in payload
                    res = await axios.put(`http://localhost:3000/api/users/student/edit/${id}`, form, { withCredentials: true });
                } else if (user?.role === 'teacher') {
                    res = await axios.put(`http://localhost:3000/api/users/teacher/${id}`, form, { withCredentials: true });
                } else {
                    // admin/employee: call backend user edit endpoint to persist changes
                    res = await axios.put(`http://localhost:3000/api/users/edit/${id}`, form, { withCredentials: true });
                }

        if (res?.data) {
        
            const updated = res.data.user || res.data.updatedUser || res.data;
            // merge with existing user object
            const merged = { ...user, ...updated };
            login(merged);
        }

        navigate('/admin/profile');
        } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || 'Update failed');
        } finally {
        setLoading(false);
        }
    };

    if (!user) return <div className="p-6">No user data.</div>;

    return (
        <div className="w-full min-h-screen p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-10 p-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-700">✏️ Edit Profile</h2>
            <button
            onClick={() => navigate('/admin/profile')}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
            >
            Cancel
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

            {user?.role === 'student' && (
            <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <input
                name="class"
                value={form.class}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            )}

            {error && <div className="text-red-600">{error}</div>}

            <div className="flex justify-end">
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
            </div>
                </form>
                    </div>
                </div>
    );
    };

    export default ProfileEdit;
