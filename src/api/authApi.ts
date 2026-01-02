import type { ApiResponse, LoginDto, UsuarioRegistroDto } from "../types/admin.types";
import { http } from "./http";


export const authApi = {
  login(data: LoginDto) {
    return http.post<ApiResponse>("/Auth/login", data);
  },

  registroUsuario(data: UsuarioRegistroDto) {
    return http.post<ApiResponse>("/Auth/registro", data);
  },

  obtenerPerfil() {
    return http.get<ApiResponse>("/Auth");
  },

  actualizarPerfil(data: Partial<UsuarioRegistroDto>) {
    return http.put<ApiResponse>("/Auth", data);
  },
};
