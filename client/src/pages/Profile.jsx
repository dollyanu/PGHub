import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/profile";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHeart,
  FaCalendarCheck,
  FaEye,
  FaPen,
  FaUserCircle,
  FaTimes,
  FaSave,
  FaUser,
} from "react-icons/fa";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
  });

  // =========================
  // GET PROFILE
  // =========================

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedUser) {
      setLoading(false);
      return;
    }

    getProfile(loggedUser.id)
      .then((res) => {
        if (res.data.success) {
          const user = res.data.user;

          setProfile(user);

          setFormData({
            id: user.id,
            full_name: user.full_name || "",
            email: user.email || "",
            phone: user.phone || "",
            city: user.city || "",
            bio: user.bio || "",
          });
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Unable to load profile.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const handleOpenEdit = () => {
    setMessage("");
    setError("");

    setFormData({
      id: profile.id,
      full_name: profile.full_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      city: profile.city || "",
      bio: profile.bio || "",
    });

    setOpen(true);
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdate = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await updateProfile(formData);

      if (res.data.success) {
        // Update profile on screen
        setProfile((prev) => ({
          ...prev,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          bio: formData.bio,
        }));

        // Update localStorage user data
        const loggedUser = JSON.parse(localStorage.getItem("user"));

        if (loggedUser) {
          const updatedUser = {
            ...loggedUser,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        setOpen(false);

        setMessage("Profile updated successfully.");

        // Hide message after 3 seconds
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setError(res.data.message || "Profile update failed.");
      }
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while updating profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // PROFILE IMAGE
  // =========================

  const profileImage = profile?.profile_image
    ? `http://localhost/PG-Hub/server/uploads/${profile.profile_image}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile?.full_name || "User"
      )}&background=0d152b&color=67e8f9&size=256`;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-600 font-medium">
              Loading profile...
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!profile) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
            <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-[#0d152b]">
              Profile Not Found
            </h2>

            <p className="text-gray-500 mt-2">
              Please login to view your profile.
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* =========================
          MAIN PROFILE SECTION
      ========================= */}

      <section className="bg-slate-100 min-h-screen py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* =========================
              SUCCESS MESSAGE
          ========================= */}

          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl flex items-center gap-3">
              <span className="text-xl">✓</span>

              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* =========================
              ERROR MESSAGE
          ========================= */}

          {error && !open && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
              {error}
            </div>
          )}

          {/* =========================
              PROFILE CARD
          ========================= */}

          <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">

            <div className="flex flex-col md:flex-row justify-between gap-6">

              {/* LEFT SIDE */}

              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

                {/* PROFILE IMAGE */}

                <div className="relative">

                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-cyan-400 shadow-md"
                  />

                  <div className="absolute bottom-1 right-1 bg-cyan-400 text-[#0d152b] w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                    <FaUser className="text-xs" />
                  </div>

                </div>

                {/* USER INFORMATION */}

                <div className="text-center sm:text-left">

                  <h1 className="text-2xl md:text-3xl font-bold text-[#0d152b]">
                    {profile.full_name}
                  </h1>

                  <p className="text-cyan-500 font-semibold mt-1">
                    {profile.role}
                  </p>

                  <p className="text-gray-500 mt-3 max-w-lg leading-relaxed">
                    {profile.bio || "No bio added yet."}
                  </p>

                </div>

              </div>

              {/* EDIT BUTTON */}

              <div>
                <button
                  onClick={handleOpenEdit}
                  className="flex items-center justify-center gap-2 border border-gray-200 text-[#0d152b] px-5 py-3 rounded-xl hover:bg-cyan-50 hover:border-cyan-300 transition duration-200 w-full md:w-auto"
                >
                  <FaPen className="text-sm" />
                  Edit Profile
                </button>
              </div>

            </div>

            {/* =========================
                CONTACT INFORMATION
            ========================= */}

            <div className="border-t mt-8 pt-7">

              <h2 className="text-lg font-bold text-[#0d152b] mb-5">
                Contact Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">

                {/* EMAIL */}

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">

                  <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center">
                    <FaEnvelope />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Email
                    </p>

                    <p className="text-gray-700 font-medium break-all">
                      {profile.email}
                    </p>
                  </div>

                </div>

                {/* PHONE */}

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">

                  <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center">
                    <FaPhoneAlt />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Phone
                    </p>

                    <p className="text-gray-700 font-medium">
                      {profile.phone || "Not added"}
                    </p>
                  </div>

                </div>

                {/* CITY */}

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">

                  <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      City
                    </p>

                    <p className="text-gray-700 font-medium">
                      {profile.city || "Not added"}
                    </p>
                  </div>

                </div>

                {/* ROLE */}

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">

                  <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center">
                    <FaUserCircle />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Account Type
                    </p>

                    <p className="text-gray-700 font-medium capitalize">
                      {profile.role}
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* =========================
              STATISTICS
          ========================= */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-7">

            {/* SHORTLIST */}

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">

              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <FaHeart className="text-red-500 text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-[#0d152b] mt-4">
                12
              </h2>

              <p className="text-gray-500 mt-1">
                Shortlisted PGs
              </p>

            </div>

            {/* BOOKINGS */}

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">

              <div className="w-14 h-14 bg-cyan-50 rounded-full flex items-center justify-center mx-auto">
                <FaCalendarCheck className="text-cyan-500 text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-[#0d152b] mt-4">
                3
              </h2>

              <p className="text-gray-500 mt-1">
                Bookings
              </p>

            </div>

            {/* VIEWS */}

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">

              <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
                <FaEye className="text-yellow-500 text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-[#0d152b] mt-4">
                27
              </h2>

              <p className="text-gray-500 mt-1">
                Viewed PGs
              </p>

            </div>

          </div>

          {/* =========================
              RECENT BOOKINGS
          ========================= */}

          <div className="bg-white rounded-3xl shadow-md mt-7 p-6 md:p-8">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#0d152b]">
                  Recent Bookings
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Your latest PG booking activity
                </p>
              </div>

              <FaCalendarCheck className="text-cyan-500 text-2xl" />

            </div>

            {/* DESKTOP TABLE */}

            <div className="hidden md:block overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b text-gray-500 text-sm">

                    <th className="text-left py-4 font-medium">
                      PG
                    </th>

                    <th className="text-left font-medium">
                      City
                    </th>

                    <th className="text-left font-medium">
                      Rent
                    </th>

                    <th className="text-left font-medium">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  <tr className="border-b">

                    <td className="py-5 font-semibold text-[#0d152b]">
                      Sunrise PG
                    </td>

                    <td className="text-gray-600">
                      Pune
                    </td>

                    <td className="text-gray-600">
                      ₹6,500
                    </td>

                    <td>
                      <span className="bg-green-100 text-green-600 px-3 py-1.5 rounded-full text-sm font-medium">
                        Confirmed
                      </span>
                    </td>

                  </tr>

                  <tr>

                    <td className="py-5 font-semibold text-[#0d152b]">
                      Royal Hostel
                    </td>

                    <td className="text-gray-600">
                      Lucknow
                    </td>

                    <td className="text-gray-600">
                      ₹5,500
                    </td>

                    <td>
                      <span className="bg-yellow-100 text-yellow-600 px-3 py-1.5 rounded-full text-sm font-medium">
                        Pending
                      </span>
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            {/* MOBILE BOOKING CARDS */}

            <div className="md:hidden space-y-4">

              <div className="border rounded-xl p-4">

                <div className="flex justify-between">

                  <h3 className="font-semibold text-[#0d152b]">
                    Sunrise PG
                  </h3>

                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                    Confirmed
                  </span>

                </div>

                <div className="flex justify-between text-sm text-gray-500 mt-3">

                  <span>Pune</span>

                  <span>₹6,500</span>

                </div>

              </div>

              <div className="border rounded-xl p-4">

                <div className="flex justify-between">

                  <h3 className="font-semibold text-[#0d152b]">
                    Royal Hostel
                  </h3>

                  <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">
                    Pending
                  </span>

                </div>

                <div className="flex justify-between text-sm text-gray-500 mt-3">

                  <span>Lucknow</span>

                  <span>₹5,500</span>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          EDIT PROFILE MODAL
      ========================= */}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-6">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="sticky top-0 bg-white border-b px-6 md:px-8 py-5 flex justify-between items-center z-10">

              <div>

                <h2 className="text-xl md:text-2xl font-bold text-[#0d152b]">
                  Edit Profile
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Update your personal information
                </p>

              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleUpdate}
              className="p-6 md:p-8 space-y-5"
            >

              {/* ERROR */}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* FULL NAME */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                />

              </div>

              {/* PHONE + CITY */}

              <div className="grid sm:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                  />

                </div>

              </div>

              {/* BIO */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us something about yourself..."
                  rows="4"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                ></textarea>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3 border-t">

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#0d152b] text-white hover:bg-cyan-600 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;