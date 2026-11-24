export interface ComprobanteBlobInfo {
  blob: Blob;
  mime: string;
  ext: string;
  isPdf: boolean;
}

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

function detectByMagicBytes(bytes: Uint8Array): Omit<ComprobanteBlobInfo, "blob"> | null {
  if (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return { mime: "application/pdf", ext: "pdf", isPdf: true };
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg", isPdf: false };
  }

  if (
    bytes.length >= 4 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return { mime: "image/png", ext: "png", isPdf: false };
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp", isPdf: false };
  }

  return null;
}

export async function resolveComprobanteBlob(
  rawBlob: Blob,
): Promise<ComprobanteBlobInfo> {
  const declaredMime = (rawBlob.type || "").split(";")[0].trim().toLowerCase();
  if (
    declaredMime &&
    declaredMime !== "application/octet-stream" &&
    !ALLOWED_MIMES.has(declaredMime)
  ) {
    throw new Error("Formato de comprobante no permitido.");
  }

  const headerBuffer = await rawBlob.slice(0, 12).arrayBuffer();
  const detected = detectByMagicBytes(new Uint8Array(headerBuffer));
  if (!detected) {
    throw new Error("Formato de comprobante no permitido.");
  }

  return {
    blob: new Blob([rawBlob], { type: detected.mime }),
    ...detected,
  };
}
