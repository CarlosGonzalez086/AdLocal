import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { normalizeComercioData } from "../utils/generalsFunctions";
import { comercioCreateSchema, comercioUpdateSchema } from "../schemas/comercioCreate.schema";

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

  it("normalizeComercioData conserva logo https:// al editar y schemas rechazan data:image/svg+xml", () => {
    const edited = normalizeComercioData({
      id: 12,
      nombre: "Café Sierra",
      logoBase64: "https://cdn.adlocal.store/logos/12.webp",
      lat: 19.4,
      lng: -99.1,
    });
    expect(edited.logoBase64).toBe("https://cdn.adlocal.store/logos/12.webp");
    expect(comercioUpdateSchema.safeParse(edited).success).toBe(true);

    const svgCreate = comercioCreateSchema.safeParse({
      nombre: "SVG Test",
      logoBase64: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=",
      lat: 19.4,
      lng: -99.1,
      estadoId: 1,
      municipioId: 2,
    });
    expect(svgCreate.success).toBe(false);
  });

  it("useComercio memoriza cargarPorId con useCallback y ComercioPageForm remonta ComercioForm al editar", () => {
    const useComercio = fs.readFileSync(path.resolve(process.cwd(), "src/hooks/useComercio.ts"), "utf8");
    const pageForm = fs.readFileSync(path.resolve(process.cwd(), "src/User/Pages/Comercio/ComercioPageForm.tsx"), "utf8");
    const preview = fs.readFileSync(path.resolve(process.cwd(), "src/User/Pages/Home/PreviewNegocio.tsx"), "utf8");

    expect(useComercio).toContain("const cargarPorId = useCallback(async");
    expect(useComercio).toContain("autoLoadRef");
    expect(pageForm).toContain("useComercio({ autoLoad: !isEditMode })");
    expect(pageForm).toContain("comercio-edit-${comercioPage?.id ?? 0}");
    expect(preview).toContain("useComercio({ autoLoad: false })");
  });

  it("UsuarioHeader/AdminHeader invocan logout backend, useActualizarJwt soporta sesión dual y planTipo no distingue mayúsculas", () => {
    const userHdr = fs.readFileSync(path.resolve(process.cwd(), "src/User/Components/UsuarioHeader.tsx"), "utf8");
    const adminHdr = fs.readFileSync(path.resolve(process.cwd(), "src/Admin/Components/AdminHeader.tsx"), "utf8");
    const actJwt = fs.readFileSync(path.resolve(process.cwd(), "src/hooks/useActualizarJwt.ts"), "utf8");
    const sidebar = fs.readFileSync(path.resolve(process.cwd(), "src/User/Components/UsuarioSidebar.tsx"), "utf8");
    const gate = fs.readFileSync(path.resolve(process.cwd(), "src/components/Comercio/ComercioPlanGate.tsx"), "utf8");
    const modal = fs.readFileSync(path.resolve(process.cwd(), "src/components/ProductosServicios/ProductoServicioModal.tsx"), "utf8");

    expect(userHdr).toContain("authUser.logoutUser()");
    expect(adminHdr).toContain("authAdmin.logoutAdmin()");
    expect(actJwt).toContain('startsWith("/admin")');
    expect(sidebar).toContain("user?.planTipo?.trim().toUpperCase()");
    expect(gate).toContain("toUpperCase()");
    expect(modal).toContain("allowedTypes.includes(file.type.toLowerCase())");
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

  it("ComisionesPage usa resolveComprobanteBlob (magic bytes), ConfirmarSuscripcionModalV3 valida Stripe HTTPS y vercel.json incluye CSP", async () => {
    const { resolveComprobanteBlob } = await import("../utils/comprobanteBlob");
    const pdfBlob = new Blob([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31])], {
      type: "application/octet-stream",
    });
    const resolvedPdf = await resolveComprobanteBlob(pdfBlob);
    expect(resolvedPdf.isPdf).toBe(true);
    expect(resolvedPdf.mime).toBe("application/pdf");
    expect(resolvedPdf.ext).toBe("pdf");

    const pngBlob = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a])], {
      type: "",
    });
    const resolvedPng = await resolveComprobanteBlob(pngBlob);
    expect(resolvedPng.isPdf).toBe(false);
    expect(resolvedPng.mime).toBe("image/png");

    const htmlBlob = new Blob(["<html></html>"], { type: "text/html" });
    await expect(resolveComprobanteBlob(htmlBlob)).rejects.toThrow();

    const comisiones = fs.readFileSync(
      path.resolve(process.cwd(), "src/Admin/Pages/Comisiones/ComisionesPage.tsx"),
      "utf8",
    );
    const modal = fs.readFileSync(
      path.resolve(process.cwd(), "src/User/Pages/Plan/ConfirmarSuscripcionModalV3.tsx"),
      "utf8",
    );
    const previewCard = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/Comercio/ComercioPreviewCard.tsx"),
      "utf8",
    );
    const prodComercio = fs.readFileSync(
      path.resolve(process.cwd(), "src/User/Pages/ProductosServicios/ProductosServicioComercio.tsx"),
      "utf8",
    );
    const vercel = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "vercel.json"), "utf8"),
    ) as { headers: Array<{ headers: Array<{ key: string; value: string }> }> };

    expect(comisiones).toContain("resolveComprobanteBlob");
    expect(comisiones).toContain("URL.revokeObjectURL");
    expect(modal).toContain('parsedCheckoutUrl.protocol === "https:"');
    expect(modal).toContain("checkout.stripe.com");
    expect(previewCard).toContain('user?.rol !== "Colaborador"');
    expect(prodComercio).toContain("totalSinFiltro");

    const csp = vercel.headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("frame-ancestors 'none'");
    expect(csp?.value).toContain("object-src 'none'");
  });
});
