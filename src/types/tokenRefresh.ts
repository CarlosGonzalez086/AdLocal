export interface UsuarioRenovado {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  comercioId?: number;
}

export interface RenovarTokenRespuesta {
  token: string;
  usuario?: UsuarioRenovado;
}

export interface RenovarTokenResponse {
  codigo: string;
  mensaje: string;
  respuesta: RenovarTokenRespuesta;
}
