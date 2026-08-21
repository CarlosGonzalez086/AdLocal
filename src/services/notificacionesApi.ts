import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
import type { ResumenNotificaciones } from "../types/notificaciones";

export const obtenerNotificaciones = async (limite = 20) =>
  (
    await httpUsuario.get<ApiResponse<ResumenNotificaciones>>(
      "Notificaciones",
      {
        params: { limite },
      },
    )
  ).data;
export const marcarNotificacionLeida = (uuid: string) =>
  httpUsuario.put(`Notificaciones/${uuid}/leida`);
export const marcarTodasLeidas = () =>
  httpUsuario.put("Notificaciones/leer-todas");
