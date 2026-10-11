import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { createBooking } from "../services/booking";
import { getProperty } from "../services/property";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // -----------------------------
  // STATES
  // -----------------------------
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);

  const [moveInDate, setMoveInDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [propertyLoading, setPropertyLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // TODAY DATE
  // -----------------------------
  const today = new Date().toISOString().split("T")[0];

  // -----------------------------
  // GET LOGGED-IN USER
  // -----------------------------
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error("User data error:", err);
      localStorage.removeItem("user");
    }
  }, []);

  // -----------------------------
  // GET PROPERTY
  // -----------------------------
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("Property ID is missing.");
        setPropertyLoading(false);
        return;
      }

      try {
        setPropertyLoading(true);
        setError("");

        const response = await getProperty(id);

        console.log("Property response:", response.data);

        if (response.data.success) {
          setProperty(response.data.property);
        } else {
          setError(
            response.data.message || "Unable to load property details."
          );
        }
      } catch (err) {
        console.error("Property loading error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load property details. Please try again."
        );
      } finally {
        setPropertyLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // -----------------------------
  // HANDLE BOOKING
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check login
    if (!user || !user.id) {
      setError("Please login before booking a property.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    // Check property ID
    if (!id) {
      setError("Property ID is missing.");
      return;
    }

    // Check date
    if (!moveInDate) {
      setError("Please select your move-in date.");
      return;
    }

    try {
      setLoading(true);

      // Data being sent to PHP backend
      const bookingData = {
        user_id: Number(user.id),
        property_id: Number(id),
        move_in_date: moveInDate,
      };

      console.log("Booking data:", bookingData);

      const response = await createBooking(bookingData);

      console.log("Booking response:", response.data);

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Booking request submitted successfully."
        );

        // Redirect to bookings page
        setTimeout(() => {
          navigate("/bookings");
        }, 1500);
      } else {
        setError(
          response.data.message ||
            "Unable to create booking."
        );
      }
    } catch (err) {
      console.error("Booking error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit booking request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // PROPERTY LOADING
  // -----------------------------
  if (propertyLoading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-600 font-medium">
              Loading property details...
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // -----------------------------
  // PROPERTY NOT FOUND
  // -----------------------------
  if (!property) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md w-full">
            <FaHome className="text-5xl text-cyan-500 mx-auto mb-5" />

            <h2 className="text-2xl font-bold text-[#0d152b]">
              Property Not Found
            </h2>

            <p className="text-gray-500 mt-3">
              {error || "The property you are trying to book does not exist."}
            </p>

            <button
              onClick={() => navigate("/properties")}
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              View Properties
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // -----------------------------
  // MAIN PAGE
  // -----------------------------
  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-100 py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#0d152b] hover:text-cyan-500 font-semibold mb-7 transition"
          >
            <FaArrowLeft />
            Back
          </button>

          {/* PAGE CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* =========================
                PROPERTY CARD
            ========================== */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

              {/* IMAGE */}
              {property.image ? (
                <img
                  src={property.image}
                  alt={property.title || "PG Property"}
                  className="w-full h-72 md:h-80 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-72 md:h-80 bg-gray-200 flex items-center justify-center">
                  <FaHome className="text-6xl text-gray-400" />
                </div>
              )}

              {/* PROPERTY DETAILS */}
              <div className="p-6 md:p-8">

                <p className="text-sm text-cyan-600 font-semibold mb-2">
                  PROPERTY DETAILS
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-[#0d152b]">
                  {property.title}
                </h1>

                {/* LOCATION */}
                <div className="flex items-start gap-2 text-gray-500 mt-4">
                  <FaMapMarkerAlt className="text-cyan-500 mt-1" />

                  <div>
                    <p>{property.location}</p>

                    {property.city && (
                      <p className="text-sm mt-1">
                        {property.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* PRICE */}
                <div className="flex items-center gap-2 mt-6">
                  <FaRupeeSign className="text-cyan-500 text-xl" />

                  <span className="text-3xl font-bold text-cyan-600">
                    {Number(property.price).toLocaleString("en-IN")}
                  </span>

                  <span className="text-gray-500">
                    / month
                  </span>
                </div>

                {/* GENDER */}
                {property.gender && (
                  <div className="mt-5">
                    <span className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full font-semibold">
                      {property.gender}
                    </span>
                  </div>
                )}

                {/* DESCRIPTION */}
                {property.description && (
                  <div className="mt-7">
                    <h3 className="font-bold text-[#0d152b] mb-2">
                      About this PG
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* AMENITIES */}
                {property.amenities && (
                  <div className="mt-7">
                    <h3 className="font-bold text-[#0d152b] mb-3">
                      Amenities
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(property.amenities)
                        ? property.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm"
                            >
                              {amenity}
                            </span>
                          ))
                        : property.amenities
                            .split(",")
                            .map((amenity, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm"
                              >
                                {amenity.trim()}
                              </span>
                            ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* =========================
                BOOKING FORM
            ========================== */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">

              {/* HEADING */}
              <div className="mb-8">
                <p className="text-sm text-cyan-600 font-semibold mb-2">
                  BOOKING REQUEST
                </p>

                <h2 className="text-3xl font-bold text-[#0d152b]">
                  Book Your PG
                </h2>

                <p className="text-gray-500 mt-2 leading-relaxed">
                  Select your preferred move-in date and submit
                  your booking request.
                </p>
              </div>

              {/* SUCCESS MESSAGE */}
              {message && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl flex items-start gap-3">
                  <FaCheckCircle className="mt-1" />

                  <div>
                    <p className="font-semibold">
                      Booking Successful
                    </p>

                    <p className="text-sm mt-1">
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-4 rounded-xl">
                  <p className="font-semibold">
                    Booking Error
                  </p>

                  <p className="text-sm mt-1">
                    {error}
                  </p>
                </div>
              )}

              {/* USER INFORMATION */}
              <div className="space-y-5">

                {/* NAME */}
                <div>
                  <label className="block font-semibold text-[#0d152b] mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={user?.full_name || ""}
                    readOnly
                    placeholder="Your name"
                    className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 outline-none text-gray-600"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block font-semibold text-[#0d152b] mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    placeholder="Your email"
                    className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 outline-none text-gray-600"
                  />
                </div>

                {/* PHONE */}
                {user?.phone && (
                  <div>
                    <label className="block font-semibold text-[#0d152b] mb-2">
                      Phone
                    </label>

                    <input
                      type="text"
                      value={user.phone}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 outline-none text-gray-600"
                    />
                  </div>
                )}

                {/* MOVE-IN DATE */}
                <div>
                  <label className="block font-semibold text-[#0d152b] mb-2">
                    Move-in Date
                  </label>

                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none" />

                    <input
                      type="date"
                      value={moveInDate}
                      min={today}
                      onChange={(e) => {
                        setMoveInDate(e.target.value);
                        setError("");
                      }}
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>

                  <p className="text-sm text-gray-400 mt-2">
                    Select a date from today onwards.
                  </p>
                </div>
              </div>

              {/* BOOKING INFORMATION */}
              <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-5 mt-7">

                <h3 className="font-semibold text-cyan-800 mb-2">
                  Booking Information
                </h3>

                <ul className="text-sm text-cyan-700 space-y-1">
                  <li>
                    • Your booking request will initially be
                    marked as Pending.
                  </li>

                  <li>
                    • The property owner/admin can review your
                    request.
                  </li>

                  <li>
                    • You can check your booking status from
                    My Bookings.
                  </li>
                </ul>
              </div>

              {/* BUTTON */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-7 bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>

              {/* LOGIN MESSAGE */}
              {!user && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Please login to submit a booking request.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}