import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
import type { CitaDto, EstadoCita } from "../types/User/citas";
export const citasComercioApi = {
  agenda: (comercioId: number, fecha?: string) => httpUsuario.get<ApiResponse<CitaDto[]>>("/Citas/agenda", { params: { comercioId, ...(fecha ? { fecha } : {}) } }),
  actualizar: (comercioId: number, uuid: string, data: { estado: EstadoCita; nombreAtiende?: string; motivo?: string }) => httpUsuario.put<ApiResponse<CitaDto>>(`/Citas/${uuid}`, data, { params: { comercioId } }),
};
