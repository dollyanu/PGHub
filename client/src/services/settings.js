import api from "./api";

export const getSettings = (userId) => {
  return api.get(
    `settings/getSettings.php?user_id=${userId}`
  );
};

export const updateSettings = (data) => {
  return api.put(
    "settings/updateSettings.php",
    data
  );
};

export const changePassword = (data) => {
  return api.put(
    "settings/changePassword.php",
    data
  );
};