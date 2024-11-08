import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaSignOutAlt, FaUserCircle, FaHistory, FaCog } from "react-icons/fa";

const HomePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const token = user.token;
  const role = user.role;

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  const handleNavigateToResources = () => {
    navigate("/resources");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    logout();
  };

  const handleNavigateToLogs = () => {
    navigate("/logs");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl w-full mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border border-gray-800 backdrop-blur-lg"

    >
      <h2 className="text-4xl font-bold mb-6 text-center text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
          VaultSecure
        </span>
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <motion.div
          className="p-6 bg-gray-800 bg-opacity-60 rounded-xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-green-400 mb-4">Profile Information</h3>
          <div className="flex items-center space-x-4 mb-4">
            <FaUserCircle className="text-4xl text-green-500" />
            <div>
              <p className="text-white text-lg">{user.name}</p>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Account Activity Section */}
        <motion.div
          className="p-6 bg-gray-800 bg-opacity-60 rounded-xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-green-400 mb-4">Account Activity</h3>
          <p className="text-white">
            <span className="font-bold">Joined:</span> {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-white">
            <span className="font-bold">Last Login:</span> {formatDate(user.lastLogin)}
          </p>
        </motion.div>
      </div>

      <div className="mt-6">
        {/* Action Buttons */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNavigateToResources}
          className="w-full py-3 px-4 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-teal-500 hover:to-teal-700 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Go to Accounts
        </motion.button>

        {role === 'Admin' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigateToLogs}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaHistory className="inline mr-2" /> Go to Logs
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <FaSignOutAlt className="inline mr-2" /> Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HomePage;
