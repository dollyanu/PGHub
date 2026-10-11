import api from "./api";

// Dashboard
export const getAdminDashboard = () => {
  return api.get("admin/dashboard/getDashboard.php");
};

// Users
export const getAdminUsers = () => {
  return api.get("admin/users/getUsers.php");
};

export const deleteAdminUser = (id) => {
  return api.delete(`admin/users/deleteUser.php?id=${id}`);
};

// Properties
export const getAdminProperties = () => {
  return api.get("admin/properties/getProperties.php");
};

export const deleteAdminProperty = (id) => {
  return api.delete(`admin/properties/deleteProperty.php?id=${id}`);
};

// Bookings
export const getAdminBookings = () => {
  return api.get("admin/bookings/getBookings.php");
};

export const updateBookingStatus = (data) => {
  return api.put("admin/bookings/updateBookingStatus.php", data);
};

export const deleteAdminBooking = (id) => {
  return api.delete(`admin/bookings/deleteBooking.php?id=${id}`);
};