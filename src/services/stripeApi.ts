import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/Stripe`,
  headers: { "Content-Type": "application/json" },
});

export const stripeApi = {
  crearCheckout: (data: { planId: number; planTipo: string }) =>
    api.post<ApiResponse<{ url: string }>>("/checkout", data),
};
