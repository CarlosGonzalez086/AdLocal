import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/locations`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export interface StateDto {
  id: number;
  name: string;
}

export interface MunicipalityDto {
  id: number;
  name: string;
  estadoId: number;
}


export const locationsApi = {
  getAllStates: () => api.get("/states"),

  getMunicipalitiesByState: (stateId: number) =>
    api.get(`/states/${stateId}/municipalities`),
};
