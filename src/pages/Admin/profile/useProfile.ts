import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { Profile, ProfileUpdateDto } from "./profile.types";
import { profileApi } from "../../../services/profile.api";


export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    nombre: "",
    email: "",
    rol: "",
    comercioId: 0,
    fechaCreacion: "",
    activo: false,
  });
  const [loading, setLoading] = useState(false);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const { data } = await profileApi.getProfile();
      setProfile(data.respuesta);
    } catch {
      Swal.fire("Error", "No se pudo cargar el perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  const actualizarPerfil = async (dto: ProfileUpdateDto) => {
    try {
      setLoading(true);
      await profileApi.updateProfile(dto);
      Swal.fire("Actualizado", "Perfil actualizado correctamente", "success");
      await cargarPerfil();
    } catch {
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  return {
    profile,
    loading,
    actualizarPerfil,
  };
};
