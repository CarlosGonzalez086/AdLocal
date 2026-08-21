import { useState } from "react";
import Swal from "sweetalert2";
import type {
  AdminCreateDto,
  EmailAdminDto,
  LoginAdminDto,
} from "../types/Admin/AdminAuth";
import { authAdmin } from "../services/authAdmin.api";
import type { NewPasswordDto } from "../types/auth";

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);

  const crearAdmin = async (data: AdminCreateDto) => {
    try {
      setLoading(true);

      const resp = await authAdmin.crearAdmin(data);

      Swal.fire(
        "Administrador creado",
        "La cuenta se creó correctamente.",
        "success",
      );

      return resp.data;
    } catch (error) {
      console.error(error);

      Swal.fire("Error", "No fue posible crear el administrador.", "error");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (data: LoginAdminDto) => {
    try {
      setLoading(true);

      const resp = await authAdmin.loginAdmin(data);

      return resp.data;
    } catch (error) {
      Swal.fire(
        "Error al iniciar sesión",
        "Verifica tus credenciales e inténtalo nuevamente.",
        "error",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgetPassword = async (data: EmailAdminDto) => {
    try {
      setLoading(true);

      const resp = await authAdmin.forgetPassword(data);

      Swal.fire(
        "Correo enviado",
        "Revisa tu correo para continuar con la recuperación de contraseña.",
        "success",
      );

      return resp.data;
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error",
        "No fue posible enviar el correo de recuperación.",
        "error",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const newPassword = async (data: NewPasswordDto) => {
    try {
      setLoading(true);

      const resp = await authAdmin.newPassword(data);

      Swal.fire(
        "Contraseña actualizada",
        "Tu contraseña se actualizó correctamente.",
        "success",
      );

      return resp.data;
    } catch (error) {
      console.error(error);

      Swal.fire("Error", "No fue posible actualizar la contraseña.", "error");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkToken = async (token: string) => {
    try {
      setLoading(true);

      const resp = await authAdmin.checkToken(token);

      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerAdmin = async () => {
    try {
      setLoading(true);

      const resp = await authAdmin.obtenerAdmin();

      return resp.data;
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error",
        "No fue posible obtener la información del administrador.",
        "error",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarAdmin = async (data: Partial<AdminCreateDto>) => {
    try {
      setLoading(true);

      const resp = await authAdmin.actualizarAdmin(data);

      Swal.fire(
        "Información actualizada",
        "Los datos del administrador se actualizaron correctamente.",
        "success",
      );

      return resp.data;
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error",
        "No fue posible actualizar la información del administrador.",
        "error",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    crearAdmin,
    loginAdmin,
    forgetPassword,
    newPassword,
    checkToken,
    obtenerAdmin,
    actualizarAdmin,
  };
};
