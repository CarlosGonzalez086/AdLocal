import axios from "axios";
import {
  clearStorageUsuario,
  getLocalStorageJWTUsuario,
} from "../utils/storageUsuario";

export const httpUsuario = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/`,
});

httpUsuario.interceptors.request.use(
  (config) => {
    const token = getLocalStorageJWTUsuario();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

httpUsuario.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("STATUS:", error.response?.status);
    console.log("ERROR API:", error.response?.data);

    const status = error.response?.status;

    if (status === 401 || status === 403) {
      clearStorageUsuario();
      window.location.href = "/usuario/login";
    }

    return Promise.reject(error);
  },
);
