import api from "./api";

// Dashboard
export const getOwnerDashboard = (ownerId) => {
  return api.get(`owner/dashboard/getDashboard.php?owner_id=${ownerId}`);
};

// Properties
export const getOwnerProperties = (ownerId) => {
  return api.get(`owner/properties/getProperties.php?owner_id=${ownerId}`);
};

export const addOwnerProperty = (data) => {
  return api.post("owner/properties/addProperty.php", data);
};

export const updateOwnerProperty = (data) => {
  return api.post("owner/properties/updateProperty.php", data);
};

export const deleteOwnerProperty = (ownerId, propertyId) => {
  return api.delete(
    `owner/properties/deleteProperty.php?owner_id=${ownerId}&id=${propertyId}`
  );
};

// Bookings
export const getOwnerBookings = (ownerId) => {
  return api.get(`owner/bookings/getBookings.php?owner_id=${ownerId}`);
};

export const updateOwnerBookingStatus = (data) => {
  return api.put("owner/bookings/updateBookingStatus.php", data);
};