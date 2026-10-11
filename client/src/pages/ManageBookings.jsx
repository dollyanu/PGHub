import { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import AdminSidebar from "../components/AdminSidebar";

import {
  getAdminBookings,
  updateBookingStatus,
  deleteAdminBooking,
} from "../services/admin";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const response = await getAdminBookings();

      if (response.data.success) {
        setBookings(response.data.bookings || []);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Bookings Error:", error);
      alert("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateBookingStatus({
        booking_id: id,
        status: status,
      });

      if (response.data.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === id
              ? { ...booking, status }
              : booking
          )
        );
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Booking Status Error:", error);
      alert("Failed to update booking.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteAdminBooking(id);

      if (response.data.success) {
        setBookings((prev) =>
          prev.filter((booking) => booking.id !== id)
        );

        alert("Booking deleted successfully.");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Delete Booking Error:", error);
      alert("Failed to delete booking.");
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

      <AdminSidebar />

      <main className="ml-64 p-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Manage Bookings
          </h1>

          <p className="text-gray-500 mt-1">
            Review and manage all property bookings.
          </p>

        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Booking
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Property
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Move-in Date
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {bookings.map((booking) => (

                    <tr
                      key={booking.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">

                        <span className="font-semibold text-gray-800">
                          #{booking.id}
                        </span>

                        <p className="text-xs text-gray-500 mt-1">
                          {booking.booking_date}
                        </p>

                      </td>


                      <td className="px-6 py-4">

                        <p className="font-semibold text-gray-800">
                          {booking.full_name ||
                            booking.user_name ||
                            "User"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.email || "-"}
                        </p>

                      </td>


                      <td className="px-6 py-4">

                        <p className="font-semibold text-gray-800">
                          {booking.title ||
                            booking.property_title ||
                            "Property"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.location || "-"}
                        </p>

                      </td>


                      <td className="px-6 py-4 text-gray-600">
                        {booking.move_in_date || "-"}
                      </td>


                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>

                      </td>


                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          {booking.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "Confirmed"
                                  )
                                }
                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                                title="Confirm"
                              >
                                <FaCheck />
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "Cancelled"
                                  )
                                }
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() =>
                              handleDelete(booking.id)
                            }
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default ManageBookings;