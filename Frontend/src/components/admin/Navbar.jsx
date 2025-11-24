import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      <button
        onClick={logout}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
