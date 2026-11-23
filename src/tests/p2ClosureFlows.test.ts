import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { normalizeComercioData } from "../utils/generalsFunctions";
import { comercioCreateSchema } from "../schemas/comercioCreate.schema";

describe("P2 Closure Security & Flows (AdLocal)", () => {
  it("normalizeComercioData convierte teléfono y correo vacíos en undefined compatibles con Zod", () => {
    const normalized = normalizeComercioData({
      nombre: "Panadería Central",
      telefono: "   ",
      email: "",
      lat: 19.4326,
      lng: -99.1332,
      estadoId: 1,
      municipioId: 2,
    });

    expect(normalized.telefono).toBeUndefined();
    expect(normalized.email).toBeUndefined();

    const parsed = comercioCreateSchema.safeParse(normalized);
    expect(parsed.success).toBe(true);
  });

  it("AppUser y PreviewNegocio soportan landing de Colaborador con comercioId y restringen pagos/comisiones", () => {
    const appUser = fs.readFileSync(
      path.resolve(process.cwd(), "src/User/AppUser.tsx"),
      "utf8",
    );
    const preview = fs.readFileSync(
      path.resolve(process.cwd(), "src/User/Pages/Home/PreviewNegocio.tsx"),
      "utf8",
    );

    expect(appUser).toContain("parsedComercioId");
    expect(appUser).toContain('user?.rol !== "Colaborador"');
    expect(appUser).toContain('path="configuracion-pagos"');
    expect(preview).toContain("urlComercioId ?? contextComercioId");
  });

  it("LegalPage, ResetPasswordPage, productosServiciosApi y MiPlanPage corrigen rutas y contratos", () => {
    const legal = fs.readFileSync(path.resolve(process.cwd(), "src/pages/LegalPage.tsx"), "utf8");
    const reset = fs.readFileSync(path.resolve(process.cwd(), "src/pages/ResetPasswordPage.tsx"), "utf8");
    const prodApi = fs.readFileSync(path.resolve(process.cwd(), "src/services/productosServiciosApi.ts"), "utf8");
    const miPlan = fs.readFileSync(path.resolve(process.cwd(), "src/User/Pages/Plan/MiPlanPage.tsx"), "utf8");
    const pageForm = fs.readFileSync(path.resolve(process.cwd(), "src/User/Pages/Comercio/ComercioPageForm.tsx"), "utf8");

    expect(legal).toContain('to="/usuario/crear-cuenta"');
    expect(legal).not.toContain('"/usuario/registro"');
    expect(reset).toContain("token,");
    expect(prodApi).toContain("`/ProductosServicios/${id}`");
    expect(miPlan).toContain('searchParams.get("checkout")');
    expect(pageForm).toContain("if (ok)");
  });

  it("ComisionesPage valida MIME, ConfirmarSuscripcionModalV3 valida Stripe HTTPS y vercel.json incluye CSP", () => {
    const comisiones = fs.readFileSync(
      path.resolve(process.cwd(), "src/Admin/Pages/Comisiones/ComisionesPage.tsx"),
      "utf8",
    );
    const modal = fs.readFileSync(
      path.resolve(process.cwd(), "src/User/Pages/Plan/ConfirmarSuscripcionModalV3.tsx"),
      "utf8",
    );
    const vercel = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "vercel.json"), "utf8"),
    ) as { headers: Array<{ headers: Array<{ key: string; value: string }> }> };

    expect(comisiones).toContain("application/pdf");
    expect(comisiones).toContain("URL.revokeObjectURL");
    expect(modal).toContain('parsedCheckoutUrl.protocol === "https:"');
    expect(modal).toContain("checkout.stripe.com");

    const csp = vercel.headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("frame-ancestors 'none'");
    expect(csp?.value).toContain("object-src 'none'");
  });
});
