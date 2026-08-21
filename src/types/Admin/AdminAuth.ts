import type { JwtClaims } from "../claims";

export interface AdminDto {
  id?: number;
  nombre: string;
  email: string;
  fotoUrl: string;
  fechaCreacion: string;
}

export interface EmailAdminDto {
  email: string;
}
export interface AdminCreateDto {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginAdminDto {
  email: string;
  password: string;
}

export const defaultJwtClaimsAdmin: JwtClaims = {
  sub: "",
  id: "",
  nombre: "",
  rol: "Admin",
  comercioId: "0",
  fotoUrl: "",
  RedeemMonthFree: "false",
  RedeemRewards: "false",
  planId: "0",
  planTipo: "N/A",
  nivelVisibilidad: "0",
  maxNegocios: "0",
  maxProductos: "0",
  maxFotos: 0,
  esatdo: "inactive",
  codigoReferido: "",
  permiteCatalogo: "False",
  tieneAnalytics: "False",
  badge: "",
  exp: 0,
  iat: 0,
};
