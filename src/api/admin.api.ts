import type {
  AdminCreateDto,
  LoginDto,
  ApiResponse,
} from "../types/admin.types";
import { http } from "./http";

export const adminApi = {
  crearAdmin(data: AdminCreateDto) {
    return http.post<ApiResponse>("/Admin/crear", data);
  },

  loginAdmin(data: LoginDto) {
    return http.post<ApiResponse>("/Admin/login", data);
  },

  obtenerAdmin() {
    return http.get<ApiResponse>("/Admin");
  },

  actualizarAdmin(data: Partial<AdminCreateDto>) {
    return http.put<ApiResponse>("/Admin", data);
  },
};
