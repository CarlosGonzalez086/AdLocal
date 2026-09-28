const path = require("path");
const sharp = require("sharp");

const inputPath = path.join(__dirname, "..", "public", "logo-adlocal.png");
const publicDir = path.join(__dirname, "..", "public");

async function generateIcons() {
  console.log("Generando iconos PWA desde:", inputPath);

  // 1. Icono 192x192 estándar PWA (transparente)
  await sharp(inputPath)
    .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, "pwa-192x192.png"));
  console.log("✓ Generado pwa-192x192.png");

  // 2. Icono 512x512 estándar PWA (transparente)
  await sharp(inputPath)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, "pwa-512x512.png"));
  console.log("✓ Generado pwa-512x512.png");

  // 3. Icono 64x64
  await sharp(inputPath)
    .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, "pwa-64x64.png"));
  console.log("✓ Generado pwa-64x64.png");

  // 4. Icono 512x512 Maskable (fondo Teal #008989 con 25% de margen de seguridad para Android)
  const innerLogo = await sharp(inputPath)
    .resize(380, 380, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 137, b: 137, alpha: 1 }, // #008989
    },
  })
    .composite([{ input: innerLogo, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "maskable-icon-512x512.png"));
  console.log("✓ Generado maskable-icon-512x512.png");

  // 5. Apple Touch Icon 180x180 (fondo arena cálido #F8F6F2 oficial)
  const appleInnerLogo = await sharp(inputPath)
    .resize(150, 150, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 248, g: 246, b: 242, alpha: 1 }, // #F8F6F2
    },
  })
    .composite([{ input: appleInnerLogo, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("✓ Generado apple-touch-icon.png");
}

generateIcons()
  .then(() => console.log("¡Todos los iconos PWA fueron generados exitosamente!"))
  .catch(console.error);

