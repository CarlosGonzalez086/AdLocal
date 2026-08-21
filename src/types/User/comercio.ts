export interface HorarioComercioDto {
  dia: number;
  abierto: boolean;
  horaApertura?: string | null;
  horaCierre?: string | null;
  horaAperturaFormateada?: string;
  horaCierreFormateada?: string;
}

export interface ComercioCreateDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;
  logoBase64?: string;
  imagenes?: string[];
  lat: number;
  lng: number;
  colorPrimario?: string;
  colorSecundario?: string;
  activo?: boolean;
  horarios?: HorarioComercioDto[];
  estadoId?: number;
  municipioId?: number;
}

export interface ComercioUpdateDto {
  id: number;
  nombre?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  descripcion?: string | null;
  logoBase64?: string | null;
  imagenes?: string[] | null;
  lat?: number | null;
  lng?: number | null;
  colorPrimario?: string | null;
  colorSecundario?: string | null;
  activo?: boolean | null;
  horarios?: HorarioComercioDto[] | null;
  estadoId?: number | null;
  municipioId?: number | null;
}

export interface ComercioDto {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  descripcion: string;
  logoBase64: string;
  imagenes: string[];
  lat: number;
  lng: number;
  colorPrimario: string;
  colorSecundario: string;
  activo: boolean;
  horarios: HorarioComercioDto[];
  estadoId: number;
  municipioId: number;
  estadoNombre: string;
  municipioNombre: string;
  promedioCalificacion: number;
  calificacion?: number;
  badge?: string;
  tipoComercioId: number;
  tipoComercio: string;
}

export const comercioDtoDefault: ComercioDto = {
  id: 0,
  nombre: "",
  direccion: "",
  telefono: "",
  email: "",
  descripcion: "",
  logoBase64: "",
  imagenes: [],
  lat: 19.4326,
  lng: -99.1332,
  colorPrimario: "#007AFF",
  colorSecundario: "#FF9500",
  activo: true,
  horarios: [],
  estadoId: 0,
  municipioId: 0,
  estadoNombre: "",
  municipioNombre: "",
  promedioCalificacion: 0,
  tipoComercioId: 0,
  tipoComercio: "",
};

export interface ComercioDtoListItem {
  id: number;
  nombre: string;
  idUsuario: number;
  descripcion?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  logoUrl?: string;
  lat?: number;
  lng?: number;
  colorPrimario?: string;
  colorSecundario?: string;
  activo: boolean;
  fechaCreacion: string;
  estadoNombre: string;
  municipioNombre: string;
  promedioCalificacion: number;
  badge: string;
  idColaborador: number;
}

export interface ColaborarDto {
  idComercio: number;
  nombre: string;
  correo: string;
}
