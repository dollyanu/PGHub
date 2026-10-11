import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FaTachometerAlt,
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: FaUsers,
    },
    {
      name: "Manage Properties",
      path: "/admin/properties",
      icon: FaBuilding,
    },
    {
      name: "Manage Bookings",
      path: "/admin/bookings",
      icon: FaCalendarCheck,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0d152b] text-white fixed left-0 top-0">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link
          to="/admin"
          className="text-2xl font-bold text-cyan-300"
        >
          PG<span className="text-white">Hub</span>
        </Link>

        <p className="text-xs text-gray-400 mt-1">
          Admin Panel
        </p>
      </div>


      {/* Menu */}
      <nav className="p-4 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                active
                  ? "bg-cyan-500 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <Icon />
              <span>{item.name}</span>
            </Link>
          );
        })}

      </nav>


      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10"
        >
          <FaHome />
          View Website
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;