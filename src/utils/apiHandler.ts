import { showErrorAlert, showSuccessAlert } from "./sweetalert";
import type { ApiResponse } from "../api/apiResponse";

export function handleApiResponse<T>(
  response: ApiResponse<T>,
  successMessage?: string
): T {
  if (response.codigo !== "200") {
    showErrorAlert("Error", response.mensaje);
    throw new Error(response.mensaje);
  }

  if (successMessage) {
    showSuccessAlert("Éxito", successMessage || response.mensaje);
  }

  return response.respuesta;
}
