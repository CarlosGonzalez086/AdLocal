export interface Profile {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  comercioId: number | null;
  fechaCreacion: string;
  activo: boolean;
}

export interface ProfileUpdateDto {
  nombre: string;
  email: string;
  password?: string;
  comercioId?: number;
}

export interface ChangePasswordDto {
  passwordActual: string;
  passwordNueva: string;
}