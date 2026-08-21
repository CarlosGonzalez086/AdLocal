import { useState } from "react";
import Swal from "sweetalert2";
import type { ChangeUserPasswordDto } from "../types/User/UserAuth";
import { profileUserApi } from "../services/userProfileApi";




export const useChangePasswordUser = () => {
  const [loading, setLoading] = useState(false);

  const cambiarPassword = async (dto: ChangeUserPasswordDto) => {
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
      await profileUserApi.changePassword(dto);

      Swal.fire(
        "Contraseña actualizada",
        "Vuelve a iniciar sesión por seguridad",
        "success"
      );

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ??
          "No se pudo cambiar la contraseña",
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
