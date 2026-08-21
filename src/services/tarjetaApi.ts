import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";

export interface CrearTarjetaDto {
  paymentMethodId: string;
  isDefault: boolean;
}

export interface TarjetaDto {
  id: number;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardType: string;
  nombre: string;
  numero: string;
  isDefault: boolean;
  stripePaymentMethodId: string;
}

export const tarjetaApi = {
  listar: () =>
    httpUsuario.get<ApiResponse<TarjetaDto[]>>("/tarjetas"),

  crear: (data: CrearTarjetaDto) =>
    httpUsuario.post<ApiResponse<TarjetaDto>>("/tarjetas", data),

  setDefault: (id: number) =>
    httpUsuario.put<ApiResponse<null>>(`/tarjetas/${id}/default`),

  eliminar: (id: number) =>
    httpUsuario.delete<ApiResponse<null>>(`/tarjetas/${id}`),
};
