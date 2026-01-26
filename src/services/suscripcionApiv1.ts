// suscripcionApi.ts
import axios from "axios";

export const suscripcionApiv1 = {
  directa: (data: any) =>
    axios.post("/suscripciones/directa", data),

  cancelar: () =>
    axios.post("/suscripciones/cancelar"),
};
