import axios from "axios";
import {
  clearStorageAdmin,
  getLocalStorageJWTAdmin,
} from "../utils/storageAdmin";

export const httpAdmin = axios.create({
  baseURL: `https://adlocalapi.onrender.com/api/`,
});

httpAdmin.interceptors.request.use(
  (config) => {
    const token = getLocalStorageJWTAdmin();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

httpAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      clearStorageAdmin();

      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  },
);
