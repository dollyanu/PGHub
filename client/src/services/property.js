import api from "./api";

// Get all properties
export const getProperties = () => {
  return api.get("properties/getProperties.php");
};

// Get single property
export const getProperty = (id) => {
  return api.get(`properties/getProperty.php?id=${id}`);
};


// Search properties
export const searchProperties = (search) => {
  return api.get(
    `properties/searchProperties.php?search=${encodeURIComponent(search)}`
  );
};

// Add property
export const addProperty = (data) => {
  return api.post("properties/addProperty.php", data);
};

// Update property
export const updateProperty = (data) => {
  return api.put("properties/updateProperty.php", data);
};

// Delete property
export const deleteProperty = (id) => {
  return api.delete(`properties/deleteProperty.php?id=${id}`);
};


// ===============================
// SHORTLIST APIs
// ===============================

// Add property to shortlist
export const addToShortlist = (userId, propertyId) => {
  return api.post("shortlist/addShortlist.php", {
    user_id: userId,
    property_id: propertyId,
  });
};

// Remove property from shortlist
export const removeFromShortlist = (userId, propertyId) => {
  return api.delete("shortlist/removeShortlist.php", {
    data: {
      user_id: userId,
      property_id: propertyId,
    },
  });
};

// Get user's shortlisted properties
export const getShortlist = (userId) => {
  return api.get(`shortlist/getShortlist.php?user_id=${userId}`);
};

// Check whether property is shortlisted
export const checkShortlist = (userId, propertyId) => {
  return api.get(
    `shortlist/checkShortlist.php?user_id=${userId}&property_id=${propertyId}`
  );
};

export const getFeaturedProperties = () =>
  api.get("properties/getFeaturedProperties.php");

export const getPopularCities = () =>
  api.get("properties/getPopularCities.php");