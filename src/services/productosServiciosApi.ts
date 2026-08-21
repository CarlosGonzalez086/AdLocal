import type { ApiResponse, PaginatedResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
import type { ProductoServicioDto } from "../types/User/productosServicios";

export const productosServiciosApi = {
  crear: (data: ProductoServicioDto) =>
    httpUsuario.post<ApiResponse<ProductoServicioDto>>(
      "/ProductosServicios",
      data,
    ),

  actualizar: (id: number, data: ProductoServicioDto) =>
    httpUsuario.put<ApiResponse<ProductoServicioDto>>(
      `/ProductosServicios/${id}`,
      data,
    ),

  eliminar: (id: number, idComercio: number) =>
    httpUsuario.delete<ApiResponse<null>>(
      `/ProductosServicios/${id}/idComercio/${idComercio}`,
    ),

  desactivar: (id: number, idComercio: number) =>
    httpUsuario.put<ApiResponse<null>>(
      `/ProductosServicios/desactivar/${id}/idComercio/${idComercio}`,
    ),

  getById: (id: number) =>
    httpUsuario.get<ApiResponse<ProductoServicioDto>>(`/${id}`),

  getAllPaged: (params?: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    search?: string;
    idComercio?: number;
  }) =>
    httpUsuario.get<ApiResponse<PaginatedResponse<ProductoServicioDto>>>(
      "/ProductosServicios",
      { params },
    ),

  getAllByComercio: (idComercio: number) =>
    httpUsuario.get<ApiResponse<ProductoServicioDto[]>>(
      `/ProductosServicios/comercio/${idComercio}`,
    ),
};
