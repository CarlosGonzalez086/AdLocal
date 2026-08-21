import { useState } from "react";
import Swal from "sweetalert2";
import type {
  EmailUserDto,
  LoginUserDto,
  UserCreateDto,
} from "../types/User/UserAuth";
import { authUser } from "../services/authUser.api";
import type { NewPasswordDto } from "../types/auth";

export const useUser = () => {
  const [loading, setLoading] = useState(false);

  const crearUser = async (data: UserCreateDto) => {
    try {
      setLoading(true);

      const resp = await authUser.crearUser(data);

      Swal.fire(
        "Usuario creado",
        "La cuenta se creó correctamente.",
        "success",
      );

      return resp.data;
    } catch (error) {
      console.error(error);

      Swal.fire("Error", "No fue posible crear el usuario.", "error");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (data: LoginUserDto) => {
    try {
      setLoading(true);

      const resp = await authUser.loginUser(data);

      return resp.data;
    } catch (error) {
      console.error(error);

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

  const forgetPassword = async (data: EmailUserDto) => {
    try {
      setLoading(true);

      const resp = await authUser.forgetPassword(data);

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

      const resp = await authUser.newPassword(data);

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

      const resp = await authUser.checkToken(token);

      return resp.data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerUser = async () => {
    try {
      setLoading(true);

      const resp = await authUser.obtenerUser();

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

  const actualizarUser = async (data: Partial<UserCreateDto>) => {
    try {
      setLoading(true);

      const resp = await authUser.actualizarUser(data);

      Swal.fire(
        "Información actualizada",
        "Los datos del usuario se actualizaron correctamente.",
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
    crearUser,
    loginUser,
    forgetPassword,
    newPassword,
    checkToken,
    obtenerUser,
    actualizarUser,
  };
};
