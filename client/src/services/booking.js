import api from "./api";

export const createBooking = (data) => {
  return api.post("bookings/createBooking.php", data);
};

export const getBookings = (userId) => {
  return api.get(`bookings/getBookings.php?user_id=${userId}`);
};

export const getBooking = (bookingId) => {
  return api.get(`bookings/getBooking.php?id=${bookingId}`);
};

export const cancelBooking = (userId, bookingId) => {
  return api.put("bookings/cancelBooking.php", {
    user_id: userId,
    booking_id: bookingId,
  });
};