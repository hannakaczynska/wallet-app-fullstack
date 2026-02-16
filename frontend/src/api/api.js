import axios from "axios";
import { getNavigate } from "../utils/navigation";
import { refreshAccessToken } from "../guards/refreshToken";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const refreshToken = localStorage.getItem("refreshToken");
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        localStorage.setItem("token", newAccessToken);
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config);
      } else {
        // Clear localStorage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("persist:root");
        const navigate = getNavigate();
        if (navigate) {
          navigate("/login");
        }
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
