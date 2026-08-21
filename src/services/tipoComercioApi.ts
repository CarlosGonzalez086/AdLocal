import type { ApiResponse } from "../api/apiResponse";
import { httpAdmin } from "../api/httpAdmin";
import { httpUsuario } from "../api/httpUsuario";
import type {
  TipoComercioCreateDto,
  TipoComercioDto,
} from "../types/Admin/tipoComercio";

export const tipoComercioApi = {
  getAllPaged: (page = 1, pageSize = 10, orderBy = "recent", search = "") =>
    httpAdmin.get<
      ApiResponse<{ items: TipoComercioDto[]; totalItems: number }>
    >(
      `/TiposComercio/getAllPaged?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&search=${search}`,
    ),

  getById: (id: number) =>
    httpAdmin.get<ApiResponse<TipoComercioDto>>(`/TiposComercio/${id}`),

  crear: (data: TipoComercioCreateDto) =>
    httpAdmin.post<ApiResponse<TipoComercioDto>>("/TiposComercio", data),

  actualizar: (id: number, data: TipoComercioCreateDto) =>
    httpAdmin.put<ApiResponse<TipoComercioDto>>(`/TiposComercio/${id}`, data),

  eliminar: (id: number) =>
    httpAdmin.delete<ApiResponse<boolean>>(`/TiposComercio/${id}`),
  getAllForSelect: () =>
    httpUsuario.get<ApiResponse<TipoComercioDto[]>>(
      `/TiposComercio/getAllForSelect`,
    ),
};
