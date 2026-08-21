import type { ApiResponse } from "../api/apiResponse";
import { httpAdmin } from "../api/httpAdmin";
import type { ComisionComercioResumen, ComisionesDashboard, PagedComisiones } from "../types/Admin/comisiones";

export const comisionesAdminApi = {
  dashboard: () => httpAdmin.get<ApiResponse<ComisionesDashboard>>("/AdminComisiones/dashboard"),
  resumen: (periodo: string) => httpAdmin.get<ApiResponse<ComisionComercioResumen[]>>("/AdminComisiones/resumen", { params: { periodo } }),
  movimientos: (page: number, pageSize: number, comercioId?: number, estatus?: number) => httpAdmin.get<ApiResponse<PagedComisiones>>("/AdminComisiones/movimientos", { params: { page, pageSize, comercioId, estatus } }),
  liquidar: (comercioId: number, periodo: string) => httpAdmin.put(`/AdminComisiones/comercios/${comercioId}/liquidar`, { periodo }),
};
