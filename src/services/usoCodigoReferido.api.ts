import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";


export const usoCodigoReferidoService = {
  misUsos() {
    return httpUsuario.get<ApiResponse<object>>("/UsoCodigoReferido/mis-usos");
  },

  contarPorCodigo(codigo: string) {
    return httpUsuario.get<ApiResponse<object>>("/UsoCodigoReferido/contar", {
      params: { codigo },
    });
  },

  totalUsos() {
    return httpUsuario.get<ApiResponse<object>>("/UsoCodigoReferido/total");
  },
};
