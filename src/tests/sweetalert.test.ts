import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import Swal, {
  appSwal,
  showConfirmDialog,
  showSuccessAlert,
  showToast,
} from "../utils/sweetalert";

describe("SweetAlert AdLocal", () => {
  afterEach(() => vi.restoreAllMocks());

  it("expone la instancia corporativa como acceso predeterminado", () => {
    expect(Swal).toBe(appSwal);
  });

  it("aplica el contrato de éxito reutilizable", async () => {
    const fire = vi.spyOn(appSwal, "fire").mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });
    await showSuccessAlert("Guardado", "Los cambios se aplicaron.");

    expect(fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Guardado",
        text: "Los cambios se aplicaron.",
        confirmButtonText: "Aceptar",
      }),
    );
  });

  it("distingue una confirmación destructiva de una ordinaria", async () => {
    const fire = vi.spyOn(appSwal, "fire").mockResolvedValue({ isConfirmed: true, isDenied: false, isDismissed: false });
    await showConfirmDialog({ title: "Eliminar", isDestructive: true });

    expect(fire).toHaveBeenCalledWith(
      expect.objectContaining({
        showCancelButton: true,
        customClass: expect.objectContaining({
          popup: expect.stringContaining("adlocal-alert--destructive"),
        }),
      }),
    );
  });

  it("usa un toast no bloqueante con tiempo limitado", async () => {
    const fire = vi.spyOn(appSwal, "fire").mockResolvedValue({ isConfirmed: false, isDenied: false, isDismissed: true });
    await showToast("Actualizado", "success", 2000);

    expect(fire).toHaveBeenCalledWith(
      expect.objectContaining({
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }),
    );
  });

  it("define glifos vectoriales para los cinco estados", () => {
    const css = fs.readFileSync(path.resolve(process.cwd(), "src/styles/sweetalert.css"), "utf8");

    for (const state of ["success", "error", "warning", "info", "question"]) {
      expect(css).toContain(`.adlocal-alert .swal2-icon.swal2-${state}`);
    }
    expect(css).toContain("mask-image: var(--adlocal-alert-glyph)");
    expect(css).toContain(".adlocal-alert .swal2-icon > *");
  });
});
