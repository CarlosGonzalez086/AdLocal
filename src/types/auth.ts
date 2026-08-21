export interface UsuarioRegistroDto {
  nombre: string;
  email: string;
  password: string;
}
export interface NewPasswordDto {
  passwordNueva: string;
  codigo: string;
}