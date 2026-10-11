import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import OwnerSidebar from "../components/OwnerSidebar";

import {
  getOwnerBookings,
  updateOwnerBookingStatus,
} from "../services/owner";

const OwnerBookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {

    try {

      setLoading(true);

      const response =
        await getOwnerBookings(user.id);

      if (response.data.success) {

        setBookings(
          response.data.bookings || []
        );

      } else {

        alert(
          response.data.message ||
            "Failed to load bookings."
        );
      }

    } catch (error) {

      console.error(
        "Owner Bookings Error:",
        error
      );

      alert("Failed to load bookings.");

    } finally {

      setLoading(false);
    }
  };

  const handleStatusChange = async (
    bookingId,
    status
  ) => {

    try {

      const response =
        await updateOwnerBookingStatus({
          owner_id: Number(user.id),
          booking_id: Number(bookingId),
          status,
        });

      if (response.data.success) {

        alert(
          `Booking ${status.toLowerCase()} successfully.`
        );

        setBookings((prev) =>
          prev.map((booking) =>
            Number(booking.id) ===
            Number(bookingId)
              ? {
                  ...booking,
                  status,
                }
              : booking
          )
        );

      } else {

        alert(
          response.data.message ||
            "Failed to update booking."
        );
      }

    } catch (error) {

      console.error(
        "Update Booking Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update booking."
      );
    }
  };

  const getStatusClass = (status) => {

    if (status === "Confirmed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <OwnerSidebar />

      <main className="ml-64 p-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Property Bookings
          </h1>

          <p className="text-gray-500 mt-1">
            Manage bookings received for your properties.
          </p>

        </div>

        {loading ? (

          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            Loading bookings...
          </div>

        ) : bookings.length === 0 ? (

          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">

            <FaCalendarAlt className="mx-auto text-4xl text-gray-300" />

            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              No bookings yet
            </h2>

            <p className="text-gray-500 mt-2">
              Bookings for your properties will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {bookings.map((booking) => (

              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  {/* Property */}
                  <div>

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                        <FaCalendarAlt />
                      </div>

                      <div>

                        <h2 className="text-lg font-bold text-gray-800">
                          {booking.property_title}
                        </h2>

                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <FaMapMarkerAlt className="text-cyan-500" />
                          {booking.property_location},{" "}
                          {booking.property_city}
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Status */}
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                  {/* Student */}
                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500 mb-2">
                      Student
                    </p>

                    <div className="flex items-center gap-2">
                      <FaUser className="text-cyan-500" />
                      <span className="font-semibold text-gray-800">
                        {booking.student_name}
                      </span>
                    </div>

                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500 mb-2">
                      Email
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-700 break-all">
                      <FaEnvelope className="text-cyan-500 shrink-0" />
                      {booking.student_email}
                    </div>

                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500 mb-2">
                      Phone
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaPhone className="text-cyan-500" />
                      {booking.student_phone ||
                        "Not provided"}
                    </div>

                  </div>

                  {/* Move-in */}
                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500 mb-2">
                      Move-in Date
                    </p>

                    <p className="font-semibold text-gray-800">
                      {booking.move_in_date}
                    </p>

                  </div>

                </div>

                {/* Booking info */}
                <div className="flex flex-wrap gap-5 mt-5 text-sm text-gray-500">

                  <span>
                    Booking ID: #
                    {booking.id}
                  </span>

                  <span>
                    Booking Date:{" "}
                    {booking.booking_date}
                  </span>

                  <span>
                    Monthly Rent: ₹
                    {Number(
                      booking.property_price
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

                {/* Actions */}
                {booking.status === "Pending" && (

                  <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t">

                    <button
                      onClick={() =>
                        handleStatusChange(
                          booking.id,
                          "Confirmed"
                        )
                      }
                      className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold"
                    >
                      Confirm Booking
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          booking.id,
                          "Cancelled"
                        )
                      }
                      className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                    >
                      Cancel Booking
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
};

export default OwnerBookings;