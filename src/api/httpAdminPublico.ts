import axios from "axios";

export const httpAdminPublico = axios.create({
  baseURL: `https://adlocalapi.onrender.com/api/`,
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
