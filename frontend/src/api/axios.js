// src/api/axios.js
import axios from "axios";
import { getToken } from "../utils/token";

// ✅ Create API instance
const api = axios.create({
  baseURL: "https://hrmsbyrrgritik.onrender.com/api",
});

// ✅ Always attach token if exists (no expiry check)
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle errors (but no forced logout)
api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export default api;
