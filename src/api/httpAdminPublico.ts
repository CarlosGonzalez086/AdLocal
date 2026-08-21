import axios from "axios";

export const httpAdminPublico = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

httpAdminPublico.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
