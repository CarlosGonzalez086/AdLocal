import Swal, { type SweetAlertIcon, type SweetAlertOptions } from "sweetalert2";
import { extraerMensajeError } from "./errorHandler";

export { extraerMensajeError };

const alertClasses = {
  container: "adlocal-alert-container",
  popup: "adlocal-alert",
  confirmButton: "adlocal-alert-confirm",
  cancelButton: "adlocal-alert-cancel",
  denyButton: "adlocal-alert-deny",
};

/**
 * Instancia preconfigurada de SweetAlert2 para AdLocalWeb y AdLocal
 * con paleta corporativa y tipografía estandarizada.
 */
export const appSwal = Swal.mixin({
  buttonsStyling: true,
  reverseButtons: true,
  customClass: alertClasses,
  confirmButtonColor: "#008989",
  cancelButtonColor: "#F8F6F2",
  denyButtonColor: "#D84028",
});

/**
 * Muestra una alerta de éxito corporativa
 */
export const showSuccessAlert = (title: string, text?: string) => {
  return appSwal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "Aceptar",
  });
};

/**
 * Muestra una alerta de error corporativa
 */
export const showErrorAlert = (title: string, text?: string) => {
  return appSwal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "Entendido",
  });
};

/**
 * Muestra una alerta de advertencia corporativa
 */
export const showWarningAlert = (title: string, text?: string) => {
  return appSwal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonText: "Aceptar",
  });
};

/**
 * Muestra una alerta informativa corporativa
 */
export const showInfoAlert = (title: string, text?: string) => {
  return appSwal.fire({
    title,
    text,
    icon: "info",
    confirmButtonText: "Aceptar",
  });
};

interface ConfirmDialogOptions extends Omit<SweetAlertOptions, "customClass" | "showCancelButton"> {
  title: string;
  isDestructive?: boolean;
}

/**
 * Muestra un diálogo de confirmación corporativo
 */
export const showConfirmDialog = async ({
  title,
  text,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  icon = "question",
  isDestructive = false,
  ...options
}: ConfirmDialogOptions) => {
  return appSwal.fire({
    ...options,
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    customClass: isDestructive
      ? {
          ...alertClasses,
          popup: "adlocal-alert adlocal-alert--destructive",
        }
      : alertClasses,
  } as SweetAlertOptions);
};

/**
 * Muestra una notificación tipo Toast corporativa
 */
export const showToast = (
  title: string,
  icon: SweetAlertIcon = "success",
  timer = 3000,
) => {
  return appSwal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    icon,
    title,
  });
};

/**
 * Notifica un error de API en modal corporativo utilizando el extractor unificado.
 */
export const notificarErrorApi = (
  error: unknown,
  fallback = "Ocurrió un error inesperado al procesar la solicitud.",
  title = "Error",
) => {
  const mensaje = extraerMensajeError(error, fallback);
  return showErrorAlert(title, mensaje);
};

/**
 * Notifica un error de API en formato Toast corporativo utilizando el extractor unificado.
 */
export const notificarToastErrorApi = (
  error: unknown,
  fallback = "Ocurrió un error inesperado.",
  timer = 4000,
) => {
  const mensaje = extraerMensajeError(error, fallback);
  return showToast(mensaje, "error", timer);
};

export default appSwal;
