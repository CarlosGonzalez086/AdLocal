import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import {
  profileUserApi,
  type ProfileUser,
  type ProfileUserUpdateDto,
} from "../services/userProfileApi ";
import { UserContext } from "../context/UserContext ";
import { useActualizarJwt } from "./useActualizarJwt";

export const useUserProfile = () => {
  const [profile, setProfile] = useState<ProfileUser>({
    id: 0,
    nombre: "",
    email: "",
    rol: "",
    comercioId: 0,
    fechaCreacion: "",
    activo: false,
    fotoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const { data } = await profileUserApi.getProfile();
      setProfile(data.respuesta);
    } catch {
      Swal.fire("Error", "No se pudo cargar el perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  const actualizarPerfil = async (dto: ProfileUserUpdateDto) => {
    try {
      setLoading(true);
      await profileUserApi.updateProfile(dto);
      Swal.fire("Actualizado", "Perfil actualizado correctamente", "success");
      await cargarPerfil();
    } catch {
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    } finally {
      setLoading(false);
    }
  };
  const subirFoto = async (file: File) => {
    const tiposPermitidos: Record<string, string[]> = {
      "image/jpeg": ["jpeg"],
      "image/jpg": ["jpg"],
      "image/png": ["png"],
      "image/webp": ["webp"],
    };

    // Validar tipo de archivo
    if (!tiposPermitidos[file.type]) {
      Swal.fire(
        "Error",
        "Solo se permiten imágenes JPEG, JPG, PNG o WEBP",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (typeof reader.result === "string") resolve(reader.result);
            else reject("Error al convertir a base64");
          };
          reader.onerror = (error) => reject(error);
        });

      const base64Data = await fileToBase64(file);

      const { data } = await profileUserApi.uploadPhoto({ base64: base64Data });

      Swal.fire("Actualizado", "Foto de perfil actualizada", "success");
      setProfile((prev) => ({ ...prev, fotoUrl: data.respuesta.url }));
      await actualizarJwt({
        email: user.sub,
        updateJWT: true,
      });
      window.location.reload();
    } catch (error) {
      Swal.fire("Error", "No se pudo subir la foto", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  return { profile, loading, actualizarPerfil, subirFoto };
};
