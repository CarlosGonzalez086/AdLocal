export interface JwtClaims {
  sub: string;
  id: string;
  nombre: string;
  rol: string;
  comercioId?: string;
  fotoUrl?: string;
  RedeemRewards?: string;
  RedeemMonthFree?: string;
  planId?: string;
  planTipo?: string;
  nivelVisibilidad?: string;
  maxNegocios?: string;
  maxProductos?: string;
  maxFotos?: number;
  esatdo?: string;
  codigoReferido: string;
  permiteCatalogo?: string;
  tieneAnalytics?: string;
  badge?: string;
  exp: number;
  iat: number;
}