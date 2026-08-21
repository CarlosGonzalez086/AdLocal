import axios from "axios";

export const httpUsuarioPublico = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

httpUsuarioPublico.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
