import type { ApiResponse, PaginatedResponse } from "../api/apiResponse";
import { httpAdmin } from "../api/httpAdmin";
import type {
  UsuarioConSuscripcionDto,
  UsuarioDto,
} from "../types/Admin/usuarios";

export const usersService = {
  getAll(params?: {
    page?: number;
    pageSize?: number;
    orderBy?: "recent" | "old" | "az" | "za";
    search?: string;
  }) {
    return httpAdmin.get<
      ApiResponse<PaginatedResponse<UsuarioConSuscripcionDto>>
    >("/Usuarios", {
      params,
    });
  },

  getById(id: number) {
    return httpAdmin.get<UsuarioDto>(`/Usuarios/${id}`);
  },

  eliminar(id: number) {
    return httpAdmin.delete(`/Usuarios/${id}`);
  },
};
