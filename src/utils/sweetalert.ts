import Swal, { type SweetAlertIcon } from "sweetalert2";

/**
 * Instancia preconfigurada de SweetAlert2 para AdLocal
 * con paleta corporativa y tipografía estandarizada.
 */
export const appSwal = Swal.mixin({
  buttonsStyling: true,
  reverseButtons: true,
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

interface ConfirmDialogOptions {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
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
}: ConfirmDialogOptions) => {
  return appSwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: isDestructive ? "#D84028" : "#008989",
  });
};

/**
 * Muestra una notificación tipo Toast corporativa
 */
export const showToast = (title: string, icon: SweetAlertIcon = "success", timer = 3000) => {
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

export default Swal;
