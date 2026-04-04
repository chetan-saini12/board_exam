import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send HTTP-only cookie on every request
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
