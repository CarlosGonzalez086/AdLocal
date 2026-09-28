import { useState } from "react";
import Swal from "../utils/sweetalert";
import type { ChangePasswordDto } from "../types/Admin/profile.types";
import { profileApi } from "../services/profile.api";
import { extraerMensajeError } from "../utils/errorHandler";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const cambiarPassword = async (dto: ChangePasswordDto) => {
    if (!dto.passwordActual || !dto.passwordNueva) {
      Swal.fire("Error", "Completa todos los campos", "warning");
      return;
    }

    if (dto.passwordNueva.length < 8) {
      Swal.fire(
        "Error",
        "La nueva contraseña debe tener al menos 8 caracteres",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);
      await profileApi.changePassword(dto);

      Swal.fire(
        "Contraseña actualizada",
        "Vuelve a iniciar sesión por seguridad",
        "success"
      );

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error: unknown) {
      Swal.fire(
        "Error",
        extraerMensajeError(error, "No se pudo cambiar la contraseña"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    cambiarPassword,
    loading,
  };
};
