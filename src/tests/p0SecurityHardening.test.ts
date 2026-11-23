import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("P0 Security Hardening (AdLocal)", () => {
  it("ComprobantePedidoModal aplica sandbox estricto al iframe del comprobante", () => {
    const file = path.resolve(
      process.cwd(),
      "src/User/Pages/Pedidos/Components/ComprobantePedidoModal.tsx",
    );
    const content = fs.readFileSync(file, "utf8");
    expect(content).toContain("<iframe");
    expect(content).toContain('sandbox=""');
    expect(content).toContain('referrerPolicy="no-referrer"');
  });

  it("formularios de configuración admin no permiten revelar claves secretas en texto plano", () => {
    const archivos = [
      "src/Admin/Pages/Configuraciones/Components/StripeConfigForm.tsx",
      "src/Admin/Pages/Configuraciones/Components/EmailConfigForm.tsx",
      "src/Admin/Pages/Configuraciones/Components/ClavesConfigForm.tsx",
    ];
    for (const rel of archivos) {
      const content = fs.readFileSync(path.resolve(process.cwd(), rel), "utf8");
      expect(content).toContain('type="password"');
      expect(content).not.toMatch(/showSecretKey|showKey/);
    }
    const emailForm = fs.readFileSync(
      path.resolve(process.cwd(), archivos[1]),
      "utf8",
    );
    expect(emailForm).not.toContain("jcarlosgonzalez086@gmail.com");
  });
});
