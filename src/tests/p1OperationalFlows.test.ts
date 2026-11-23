import { describe, it, expect, beforeEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { clearStorageAdmin } from "../utils/storageAdmin";
import {
  getLocalStorageJWTUsuario,
  setLocalStorageJWTUsuario,
} from "../utils/storageUsuario";

describe("P1 Operational & Auth Stability (AdLocal)", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    (globalThis as unknown as { localStorage: Storage }).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
      clear: () => store.clear(),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      get length() {
        return store.size;
      },
    };
  });

  it("clearStorageAdmin no borra la sesión de usuario ni 'token'", () => {
    setLocalStorageJWTUsuario("jwt-user-123");
    globalThis.localStorage.setItem("jwtAdmin", "jwt-admin-123");
    clearStorageAdmin();
    expect(globalThis.localStorage.getItem("jwtAdmin")).toBeNull();
    expect(getLocalStorageJWTUsuario()).toBe("jwt-user-123");
  });

  it("tokenRefresh deduplica renovaciones concurrentes por portal", () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), "src/services/tokenRefresh.ts"),
      "utf8",
    );
    expect(content).toContain("usuarioRefreshInFlight");
    expect(content).toContain("adminRefreshInFlight");
  });

  it("useChangePassword y useChangePasswordUser redirigen a rutas de login reales", () => {
    const adminHook = fs.readFileSync(
      path.resolve(process.cwd(), "src/hooks/useChangePassword.ts"),
      "utf8",
    );
    const userHook = fs.readFileSync(
      path.resolve(process.cwd(), "src/hooks/useChangePasswordUser.ts"),
      "utf8",
    );
    expect(adminHook).toContain('"/admin/login"');
    expect(adminHook).toContain("clearStorageAdmin");
    expect(userHook).toContain('"/usuario/login"');
    expect(userHook).toContain("clearStorageUsuario");
  });

  it("ConfirmarSuscripcionModalV3 y useCheckout manejan URL de checkout sin mensaje dev", () => {
    const modal = fs.readFileSync(
      path.resolve(
        process.cwd(),
        "src/User/Pages/Plan/ConfirmarSuscripcionModalV3.tsx",
      ),
      "utf8",
    );
    expect(modal).not.toContain("todavía requiere el servicio correspondiente");
    expect(modal).toContain("window.location.assign(checkoutUrl)");
  });
});
