export interface AdminCreateDto {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  codigo: string;
  mensaje: string;
  respuesta: T;
}

export interface UsuarioRegistroDto {
  nombre: string;
  email: string;
  password: string;
}