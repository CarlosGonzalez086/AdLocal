import type { ApiResponse, PaginatedResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
import type {
  ColaborarDto,
  ComercioCreateDto,
  ComercioDto,
  ComercioDtoListItem,
  ComercioUpdateDto,
} from "../types/User/comercio";
import type { ProfileUser } from "../types/User/UserAuth";


export const comercioApi = {
  getMine: () => httpUsuario.get<ApiResponse<ComercioDto>>("/comercios/mine"),
  getTotalComerciosByIdUsuario: () =>
    httpUsuario.get<ApiResponse<object>>(
      "/comercios/getTotalComerciosByIdUsuario",
    ),

  crear: (data: ComercioCreateDto) =>
    httpUsuario.post<ApiResponse<ComercioDto>>("/comercios", data),

  actualizar: (data: ComercioUpdateDto) =>
    httpUsuario.put<ApiResponse<ComercioDto>>("/comercios", data),

  eliminar: (id: number) =>
    httpUsuario.delete<ApiResponse<null>>(`/comercios/${id}`),
  getAllComerciosByUser: (page = 1, pageSize = 10) =>
    httpUsuario.get<ApiResponse<PaginatedResponse<ComercioDtoListItem>>>(
      "/comercios/getAllComerciosByUser",
      {
        params: { page, pageSize },
      },
    ),
  getById: (id: number) =>
    httpUsuario.get<ApiResponse<ComercioDto>>(`/comercios/${id}`),
  guardarColaborador: (data: ColaborarDto) =>
    httpUsuario.post<ApiResponse<object>>(
      "/comercios/guardarColaborador",
      data,
    ),
  getAllColaboradores: (idComercio = 0, page = 1, pageSize = 10) =>
    httpUsuario.get<ApiResponse<PaginatedResponse<ProfileUser>>>(
      "/comercios/getAllColaboradores",
      {
        params: { idComercio, page, pageSize },
      },
    ),
  toggleAccesoColaborador: (idColaborador: number, idComercio: number) =>
    httpUsuario.put<ApiResponse<object>>(
      `/comercios/toggleAccesoColaborador`,
      null,
      {
        params: {
          idColaborador,
          idComercio,
        },
      },
    ),
  eliminarColaborador: (idColaborador: number, idComercio: number) =>
    httpUsuario.delete<ApiResponse<object>>(`/comercios/eliminarColaborador`, {
      params: {
        idColaborador,
        idComercio,
      },
    }),
};
