import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("P2 Cleanup, Accessibility & Security Headers (AdLocal)", () => {
  it("index.html configura lang='es', permite zoom y no duplica Bootstrap CDN", () => {
    const html = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");
    expect(html).toContain('<html lang="es">');
    expect(html).not.toContain("user-scalable=no");
    expect(html).not.toContain("maximum-scale=1.0");
    expect(html).not.toContain("cdn.jsdelivr.net/npm/bootstrap");
  });

  it("main.tsx evita width 100vw y theme.ts no deshabilita enforceFocus globalmente", () => {
    const main = fs.readFileSync(path.resolve(process.cwd(), "src/main.tsx"), "utf8");
    const theme = fs.readFileSync(path.resolve(process.cwd(), "src/theme/theme.ts"), "utf8");

    expect(main).not.toContain('"100vw"');
    expect(main).toContain('width: "100%"');
    expect(theme).not.toContain("disableEnforceFocus");
  });

  it("UserContext.tsx sin espacios y App.tsx expone /terminos y /privacidad", () => {
    expect(fs.existsSync(path.resolve(process.cwd(), "src/context/UserContext.tsx"))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), "src/context/UserContext .tsx"))).toBe(false);

    const app = fs.readFileSync(path.resolve(process.cwd(), "src/App.tsx"), "utf8");
    expect(app).toContain('path="/terminos"');
    expect(app).toContain('path="/privacidad"');
  });

  it("vercel.json define cabeceras de seguridad manteniendo rewrites SPA", () => {
    const vercel = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "vercel.json"), "utf8"),
    ) as {
      headers: Array<{ headers: Array<{ key: string }> }>;
      rewrites: Array<{ source: string; destination: string }>;
    };

    const keys = vercel.headers[0].headers.map((h) => h.key);
    expect(keys).toContain("X-Content-Type-Options");
    expect(keys).toContain("X-Frame-Options");
    expect(keys).toContain("Strict-Transport-Security");
    expect(vercel.rewrites[0].destination).toBe("/index.html");
  });
});
