import type {
  ApiResponse,
  LoginDto,
  UsuarioRegistroDto,
} from "../types/admin.types";
import { http } from "./http";
import emailjs from "@emailjs/browser";

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

export const sendWelcomeEmail = async (nombre: string, email: string) => {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      nombre,
      email,
      year: new Date().getFullYear(),
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
