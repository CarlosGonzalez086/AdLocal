import Swal from "sweetalert2";
import type { ApiResponse } from "../api/apiResponse";


export function handleApiResponse<T>(
  response: ApiResponse<T>,
  successMessage?: string
): T {
  if (response.codigo !== "200") {
    Swal.fire("Error", response.mensaje, "error");
    throw new Error(response.mensaje);
  }

  if (successMessage) {
    Swal.fire("Éxito", successMessage || response.mensaje, "success");
  }

  return response.respuesta;
}
