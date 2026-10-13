import { afterEach, describe, expect, it, vi } from "vitest";
import type { AxiosAdapter } from "axios";

vi.mock("../utils/storageAdmin", () => ({
  getLocalStorageJWTAdmin: () => "synthetic-admin-token",
  clearStorageAdmin: vi.fn(),
}));
vi.mock("../services/tokenRefresh", () => ({ renovarTokenAdmin: vi.fn() }));

import { authAdmin } from "../services/authAdmin.api";
import { httpAdmin } from "../api/httpAdmin";
import { httpAdminPublico } from "../api/httpAdminPublico";

const adminAdapter = httpAdmin.defaults.adapter;
const publicAdapter = httpAdminPublico.defaults.adapter;
afterEach(() => {
  httpAdmin.defaults.adapter = adminAdapter;
  httpAdminPublico.defaults.adapter = publicAdapter;
});

describe("Creación administrativa autenticada", () => {
  it("envía el JWT por el cliente autenticado y no utiliza el público", async () => {
    let authorization: unknown;
    const adapter: AxiosAdapter = async (config) => {
      authorization = config.headers.Authorization;
      expect(config.url).toBe("/Admin/crear");
      return { config, data: { codigo: "200", respuesta: null }, status: 200, statusText: "OK", headers: {} };
    };
    httpAdmin.defaults.adapter = adapter;
    httpAdminPublico.defaults.adapter = async () => { throw new Error("Alta administrativa por cliente público"); };
    await authAdmin.crearAdmin({ nombre: "Prueba", email: "test@example.test", password: "SyntheticPassword123!" });
    expect(authorization).toBe("Bearer synthetic-admin-token");
  });

  it("conserva el login público sin necesitar un JWT", async () => {
    httpAdmin.defaults.adapter = async () => { throw new Error("Login requiere sesión previa"); };
    httpAdminPublico.defaults.adapter = async (config) => {
      expect(config.url).toBe("/Admin/login");
      expect(config.headers.Authorization).toBeUndefined();
      return { config, data: { codigo: "200", respuesta: null }, status: 200, statusText: "OK", headers: {} };
    };
    await authAdmin.loginAdmin({ email: "test@example.test", password: "SyntheticPassword123!" });
  });
});
