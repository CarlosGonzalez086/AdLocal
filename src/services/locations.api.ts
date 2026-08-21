import { httpUsuario } from "../api/httpUsuario";
export interface StateDto {
  id: number;
  name: string;
}
export interface MunicipalityDto {
  id: number;
  name: string;
  estadoId: number;
}
export const locationsApi = {
  getAllStates: () => httpUsuario.get("/locations/states"),

  getMunicipalitiesByState: (stateId: number) =>
    httpUsuario.get(`/locations/states/${stateId}/municipalities`),
};
