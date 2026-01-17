import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { locationsApi, type MunicipalityDto, type StateDto } from "../services/locations.api";


export const useLocations = () => {
  const [states, setStates] = useState<StateDto[]>([]);
  const [municipalities, setMunicipalities] = useState<MunicipalityDto[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllStates = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await locationsApi.getAllStates();
      setStates(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo cargar la información de los estados",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const getMunicipalitiesByState = useCallback(async (stateId: number) => {
    if (!stateId) {
      setMunicipalities([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await locationsApi.getMunicipalitiesByState(stateId);
      setMunicipalities(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo cargar la información de los municipios",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMunicipalities = () => {
    setMunicipalities([]);
  };

  return {
    states,
    municipalities,
    loading,
    getAllStates,
    getMunicipalitiesByState,
    clearMunicipalities,
  };
};
