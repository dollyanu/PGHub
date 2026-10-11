import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/PG-Hub/server/api/",
});

export default api;