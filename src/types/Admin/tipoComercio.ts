export interface TipoComercioCreateDto {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface TipoComercioDto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}
