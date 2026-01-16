import { useState } from "react";
import axios from "axios";

import type { ApiResponse } from "../api/apiResponse";
import { authApi, type EmailDto, type NewPasswordDto } from "../services/auth.api";

interface UseForgetPasswordResult {
  forgetPassword: (email: string) => Promise<void>;
  checkToken: (token: string) => Promise<boolean>;
  newPassword: (data: NewPasswordDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const useForgetPassword = (): UseForgetPasswordResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const forgetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const emailDto: EmailDto = {
        email: email,
      };
      const response = await authApi.forgetPassword(emailDto);
      const data = response.data as ApiResponse<null>;

      if (data.codigo !== "200") {
        setError(data.mensaje);
        return;
      }

      setSuccessMessage(data.mensaje);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Error al enviar el correo");
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkToken = async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.checkToken(token);
      const data = response.data as ApiResponse<null>;

      if (data.codigo !== "200") {
        setError(data.mensaje);
        return false;
      }

      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Token inválido o expirado");
      } else {
        setError("Error inesperado");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const newPassword = async (dataDto: NewPasswordDto) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await authApi.newPassword(dataDto);
      const data = response.data as ApiResponse<null>;

      if (data.codigo !== "200") {
        setError(data.mensaje);
        return;
      }

      setSuccessMessage(data.mensaje);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.mensaje || "Error al cambiar la contraseña"
        );
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    forgetPassword,
    checkToken,
    newPassword,
    loading,
    error,
    successMessage,
  };
};
