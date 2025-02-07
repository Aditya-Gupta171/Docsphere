import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout");
      localStorage.clear();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center fixed top-0 w-full z-50">
      <h1 className="text-2xl font-bold text-white">DocSphere</h1>
      
      <div className="relative">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <span>{user.name}</span>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </button>

        {showProfile && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-sm text-gray-300">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;