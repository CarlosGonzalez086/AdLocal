import { httpAdmin } from "../api/httpAdmin";
import type { PlanCreateDto } from "../types/Admin/planes";

export const planApi = {
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    search?: string;
  }) => httpAdmin.get("/planes", { params }),

  getAllPlanesUser: () => httpAdmin.get("/planes/AllPlanesUser"),

  getById: (id: number) => httpAdmin.get(`/planes/${id}`),

  crear: (data: PlanCreateDto) => httpAdmin.post("/planes", data),

  actualizar: (id: number, data: PlanCreateDto) =>
    httpAdmin.put(`/planes/${id}`, data),

  eliminar: (id: number) => httpAdmin.delete(`/planes/${id}`),
};
