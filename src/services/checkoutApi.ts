import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
export interface CheckoutResponseDto {
  url?: string;
}
export interface SimpleResponse {
  message?: string;
}
export const checkoutApi = {
  suscribirseConTarjetaGuardada: (
    planId: number,
    stripePaymentMethodId: string,
    autoRenew: boolean,
  ) =>
    httpUsuario.post<ApiResponse<SimpleResponse>>("/checkout/suscribirse", {
      planId,
      stripePaymentMethodId,
      autoRenew,
    }),

  crearCheckoutStripe: (planId: number) =>
    httpUsuario.post<ApiResponse<CheckoutResponseDto>>("/checkout/checkout", {
      planId,
    }),

  cancelarPlan: () =>
    httpUsuario.post<ApiResponse<SimpleResponse>>("/checkout/cancelar"),
};
