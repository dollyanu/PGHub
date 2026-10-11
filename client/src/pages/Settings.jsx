import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendarCheck,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import {
  getSettings,
  updateSettings,
  changePassword,
} from "../services/settings";

const Settings = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [bookingNotifications, setBookingNotifications] =
    useState(true);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    setUser(currentUser);

    loadSettings(currentUser.id);
  }, [navigate]);

  const loadSettings = async (userId) => {
    try {
      setLoading(true);

      const response = await getSettings(userId);

      if (response.data.success) {
        const settings = response.data.settings;

        setBookingNotifications(
          settings.booking_notifications
        );

        setEmailNotifications(
          settings.email_notifications
        );
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Settings Error:", error);

      alert("Unable to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const response = await updateSettings({
        user_id: Number(user.id),
        booking_notifications: bookingNotifications,
        email_notifications: emailNotifications,
      });

      if (response.data.success) {
        alert("Settings saved successfully.");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Update Settings Error:", error);

      alert("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.current_password) {
      alert("Enter your current password.");
      return;
    }

    if (!passwordData.new_password) {
      alert("Enter a new password.");
      return;
    }

    if (passwordData.new_password.length < 6) {
      alert("New password must contain at least 6 characters.");
      return;
    }

    if (
      passwordData.new_password !==
      passwordData.confirm_password
    ) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await changePassword({
        user_id: Number(user.id),
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });

      if (response.data.success) {
        alert("Password changed successfully.");

        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Password Change Error:", error);

      alert("Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-600">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <div className="bg-[#0d152b] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <Link
            to="/"
            className="text-2xl font-bold text-cyan-300"
          >
            PG<span className="text-white">Hub</span>
          </Link>

          <div className="flex items-center gap-3">
            <FaUser className="text-cyan-300" />

            <span>
              {user?.full_name || "User"}
            </span>
          </div>

        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="bg-white rounded-2xl shadow-sm p-5 h-fit">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Account
            </h2>

            <div className="space-y-2">

              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-50 text-gray-700"
              >
                <FaUser />
                Profile
              </Link>

              <Link
                to="/bookings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-50 text-gray-700"
              >
                <FaCalendarCheck />
                My Bookings
              </Link>

              <Link
                to="/shortlist"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-50 text-gray-700"
              >
                <FaHeart />
                Shortlist
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-50 text-cyan-600 font-semibold"
              >
                <FaCog />
                Settings
              </Link>

            </div>


            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>

          </aside>


          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">

            {/* Account Information */}
            <section className="bg-white rounded-2xl shadow-sm p-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Account Information
              </h2>

              <p className="text-gray-500 mt-1 mb-6">
                Your basic account details.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={user?.full_name || ""}
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Phone
                  </label>

                  <input
                    type="text"
                    value={user?.phone || ""}
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Role
                  </label>

                  <input
                    type="text"
                    value={user?.role || "User"}
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                  />
                </div>

              </div>

            </section>


            {/* Notifications */}
            <section className="bg-white rounded-2xl shadow-sm p-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Notification Settings
              </h2>

              <p className="text-gray-500 mt-1 mb-6">
                Choose which notifications you want to receive.
              </p>


              {/* Booking notification */}
              <div className="flex items-center justify-between py-5 border-b">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-full bg-cyan-50 flex items-center justify-center">
                    <FaBell className="text-cyan-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Booking Notifications
                    </h3>

                    <p className="text-sm text-gray-500">
                      Get updates about your bookings.
                    </p>
                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setBookingNotifications(
                      !bookingNotifications
                    )
                  }
                  className={`w-12 h-6 rounded-full transition ${
                    bookingNotifications
                      ? "bg-cyan-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${
                      bookingNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>

              </div>


              {/* Email notification */}
              <div className="flex items-center justify-between py-5">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-full bg-cyan-50 flex items-center justify-center">
                    <FaEnvelope className="text-cyan-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Email Notifications
                    </h3>

                    <p className="text-sm text-gray-500">
                      Receive important updates through email.
                    </p>
                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setEmailNotifications(
                      !emailNotifications
                    )
                  }
                  className={`w-12 h-6 rounded-full transition ${
                    emailNotifications
                      ? "bg-cyan-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${
                      emailNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>

              </div>


              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>

            </section>


            {/* Change Password */}
            <section className="bg-white rounded-2xl shadow-sm p-6">

              <div className="flex items-center gap-3 mb-2">

                <div className="w-11 h-11 rounded-full bg-cyan-50 flex items-center justify-center">
                  <FaLock className="text-cyan-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Change Password
                </h2>

              </div>

              <p className="text-gray-500 mb-6">
                Keep your PGHub account secure by using a strong password.
              </p>


              <form
                onSubmit={handlePasswordChange}
                className="space-y-5"
              >

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Current Password
                  </label>

                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current_password: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm_password: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>


                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-[#0d152b] hover:bg-[#182442] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  {passwordLoading
                    ? "Changing Password..."
                    : "Change Password"}
                </button>

              </form>

            </section>

          </main>

        </div>

      </div>

    </div>
  );
};

export default Settings;