import { httpAdmin } from "../api/httpAdmin";

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

export const configuracionApi = {
  guardarStripe: (data: StripeConfiguracionDto) =>
    httpAdmin.post("/Configuracion/stripe", data),

  guardarClaves: (data: ClavesConfigDto) =>
    httpAdmin.post("/Configuracion/claves", data),

  obtenerTodas: () => httpAdmin.get("/Configuracion/listar"),

  guardarComisionMarketplace: (data: ComisionMarketplaceDto) =>
    httpAdmin.post("/Configuracion/comision-marketplace", data),
  guardarEmail: (data: EmailConfiguracionDto) =>
    httpAdmin.post("/Configuracion/correo", data),
};
