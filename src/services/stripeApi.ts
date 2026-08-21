
import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";



export const stripeApi = {
  crearCheckout: (data: { planId: number; planTipo: string }) =>
    httpUsuario.post<ApiResponse<{ url: string }>>("/Stripe/checkout", data),
};
