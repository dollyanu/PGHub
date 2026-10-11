import api from "./api";

export const getProfile = (userId) => {
  return api.post("profile/getProfile.php", {
    user_id: userId,
  });
};

export const updateProfile = (data) => {
  return api.put("profile/updateProfile.php", data);
};