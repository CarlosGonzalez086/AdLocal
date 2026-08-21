import type { JwtClaims } from "../claims";

export interface UserDto {
  id?: number;
  nombre: string;
  email: string;
  fotoUrl: string;
  fechaCreacion: string;
}

export interface EmailUserDto {
  email: string;
}
export interface UserCreateDto {
  nombre: string;
  email: string;
  password: string;
  codigoReferenciado: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export const defaultJwtClaimsUser: JwtClaims = {
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
export interface ProfileUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  comercioId: number | null;
  fechaCreacion: string;
  activo: boolean;
  fotoUrl: string;
}

export interface ProfileUserUpdateDto {
  nombre: string;
  email: string;
  password?: string;
  comercioId?: number;
}

export interface ChangeUserPasswordDto {
  passwordActual: string;
  passwordNueva: string;
}

export const initialProfile: ProfileUser = {
  id: 0,
  nombre: "",
  email: "",
  rol: "",
  comercioId: null,
  fechaCreacion: "",
  activo: false,
  fotoUrl: "",
};
