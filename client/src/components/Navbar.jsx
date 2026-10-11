import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaHome,
  FaBuilding,
  FaInfoCircle,
  FaPhoneAlt,
  FaHeart,
  FaUser,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {

  const user = JSON.parse(localStorage.getItem("user"));

const [openMenu, setOpenMenu] = useState(false);

const menuRef = useRef();

const handleLogout = () => {
  localStorage.removeItem("user");

  window.location.href = "/";
};

useEffect(() => {
  function handleClick(e) {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setOpenMenu(false);
    }
  }

  document.addEventListener("mousedown", handleClick);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClick
    );
}, []);

  return (
  <nav className="bg-white shadow sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between h-20">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-cyan-500"
        >
          🏠 PGHub
        </Link>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-8 font-serif">
          <li>
            <NavLink to="/" className="flex items-center gap-2 hover:text-cyan-500">
              <FaHome />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/properties" className="flex items-center gap-2 hover:text-cyan-500">
              <FaBuilding />
              Properties
            </NavLink>
          </li>

          <li>
            <NavLink to="/shortlist" className="flex items-center gap-2 hover:text-cyan-500">
              <FaHeart />
              Shortlist
            </NavLink>
          </li>

          <li>
            <NavLink to="/fqas" className="flex items-center gap-2 hover:text-cyan-500">
              <FaInfoCircle />
              FAQs
            </NavLink>
          </li>
        </ul>

        {/* Right Side */}
        <div className="relative" ref={menuRef}>
          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="bg-cyan-500 text-white px-5 py-2 rounded-xl hover:bg-cyan-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="border border-cyan-500 text-cyan-500 px-5 py-2 rounded-xl hover:bg-cyan-50"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    user.profile_image
                      ? `http://localhost/PG-Hub/server/uploads/${user.profile_image}`
                      : "https://i.pravatar.cc/150?img=5"
                  }
                  className="w-11 h-11 rounded-full border-2 border-cyan-500 object-cover"
                  alt="Profile"
                />

                <div className="hidden md:block text-left">
                  <h3 className="font-semibold">{user.full_name}</h3>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border overflow-hidden">

                  <div className="p-5 border-b flex gap-3 items-center">
                    <img
                      src={
                        user.profile_image
                          ? `http://localhost/PG-Hub/server/uploads/${user.profile_image}`
                          : "https://i.pravatar.cc/150?img=5"
                      }
                      className="w-14 h-14 rounded-full object-cover"
                      alt=""
                    />

                    <div>
                      <h3 className="font-bold">{user.full_name}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100"
                  >
                    <FaUser />
                    My Profile
                  </Link>

                  <Link
                    to="/bookings"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100"
                  >
                    <FaCalendarAlt />
                    My Bookings
                  </Link>

                  <Link
                    to="/shortlist"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100"
                  >
                    <FaHeart />
                    My Shortlist
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100"
                  >
                    <FaCog />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  </nav>
);
}

export default Navbar;
