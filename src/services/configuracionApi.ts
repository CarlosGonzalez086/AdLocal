import { httpAdmin } from "../api/httpAdmin";
import type { ApiResponse } from "../api/apiResponse";

export interface StripeConfiguracionDto {
  publishableKey: string;
  secretKey: string;
  commissionPercentage: string;
  commissionFixed: string;
}

export interface ClavesConfigDto {
  ip2locationKey: string;
}

export interface ComisionMarketplaceDto {
  porcentaje: number;
  montoFijo: number;
  activa: boolean;
}
export interface EmailConfiguracionDto {
  host: string;
  port: number;
  user: string;
  key: string;
  from: string;
  fromNombre: string;
}

export interface ConfiguracionItemDto {
  key: string;
  val: string | null;
}

export const configuracionApi = {
  guardarStripe: (data: StripeConfiguracionDto) =>
    httpAdmin.post("/Configuracion/stripe", data),

  guardarClaves: (data: ClavesConfigDto) =>
    httpAdmin.post("/Configuracion/claves", data),

  obtenerTodas: () =>
    httpAdmin.get<ApiResponse<ConfiguracionItemDto[]>>("/Configuracion/listar"),

  guardarComisionMarketplace: (data: ComisionMarketplaceDto) =>
    httpAdmin.post("/Configuracion/comision-marketplace", data),
  guardarEmail: (data: EmailConfiguracionDto) =>
    httpAdmin.post("/Configuracion/correo", data),
};
