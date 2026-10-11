import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings, cancelBooking } from "../services/booking";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.id) {
        setError("Please login to view your bookings.");
        setLoading(false);
        return;
      }

      console.log("Fetching bookings for user:", user.id);

      const response = await getBookings(Number(user.id));

      console.log("Bookings API Response:", response.data);

      if (response.data.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError(response.data.message || "Failed to fetch bookings.");
      }
    } catch (err) {
      console.error("Bookings API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const response = await cancelBooking(
        Number(user.id),
        Number(bookingId)
      );

      console.log("Cancel Response:", response.data);

      if (response.data.success) {
        alert("Booking cancelled successfully.");
        fetchBookings();
      } else {
        alert(response.data.message || "Unable to cancel booking.");
      }
    } catch (err) {
      console.error("Cancel Booking Error:", err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while cancelling the booking."
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-300 border-t-cyan-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600 font-medium">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="text-cyan-600 font-semibold hover:underline"
          >
            ← Back to Home
          </Link>

          <div className="mt-10 bg-white rounded-2xl shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500">
              Unable to Load Bookings
            </h2>

            <p className="text-gray-600 mt-3">{error}</p>

            <button
              onClick={fetchBookings}
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              My Bookings
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage your PG booking requests
            </p>
          </div>

          <Link
            to="/properties"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold text-center"
          >
            Browse Properties
          </Link>
        </div>

        {/* No Bookings */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-6xl mb-4">🏠</div>

            <h2 className="text-2xl font-bold text-slate-800">
              No Bookings Found
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't booked any PG yet.
            </p>

            <Link
              to="/properties"
              className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Find a PG
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="p-6">

                  {/* Top Section */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        {booking.title}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        📍 {booking.location}, {booking.city}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold w-fit
                        ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">
                        Monthly Rent
                      </p>

                      <p className="text-lg font-bold text-cyan-600 mt-1">
                        ₹{Number(booking.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">
                        Gender
                      </p>

                      <p className="text-lg font-semibold text-slate-800 mt-1">
                        {booking.gender}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">
                        Booking Date
                      </p>

                      <p className="text-lg font-semibold text-slate-800 mt-1">
                        {booking.booking_date}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">
                        Move-in Date
                      </p>

                      <p className="text-lg font-semibold text-slate-800 mt-1">
                        {booking.move_in_date}
                      </p>
                    </div>

                  </div>

                  {/* Owner */}
                  <div className="mt-6 border-t pt-5">
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Property Owner
                    </h3>

                    <p className="text-gray-600">
                      {booking.owner_name}
                    </p>

                    <p className="text-gray-600">
                      📞 {booking.owner_phone}
                    </p>
                  </div>

                  {/* Amenities */}
                  {booking.amenities?.length > 0 && (
                    <div className="mt-5">
                      <h3 className="font-semibold text-slate-800 mb-2">
                        Amenities
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {booking.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">

                    <Link
                      to={`/property/${booking.property_id}`}
                      className="flex-1 text-center border border-cyan-500 text-cyan-600 hover:bg-cyan-50 py-3 rounded-lg font-semibold"
                    >
                      View Property
                    </Link>

                    {booking.status !== "Cancelled" && (
                      <button
                        onClick={() =>
                          handleCancel(booking.booking_id)
                        }
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
                      >
                        Cancel Booking
                      </button>
                    )}

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;