/**
 * Utilidad unificada de manejo y extracción de errores para AdLocal.
 * Extrae mensajes de negocio, valida contratos ApiResponse y blinda
 * accesos contra errores de red, timeouts o payloads imprevistos.
 */

export interface ApiErrorInfo {
  codigo?: string;
  mensaje: string;
  status?: number;
  esErrorConexion: boolean;
  detalles?: string[];
}

interface AxiosErrorShape {
  response?: {
    status?: number;
    data?: unknown;
  };
  code?: string;
  message?: string;
}

/**
 * Extrae un mensaje de error amigable y seguro desde cualquier tipo de error capturado
 * (AxiosError, Error estándar, ApiResponse de negocio, ProblemDetails o error de red).
 * Garantiza que nunca se produzca una excepción por propiedades indefinidas.
 */
export function extraerMensajeError(
  error: unknown,
  fallback = "Ha ocurrido un error inesperado al procesar la solicitud.",
): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  const err = typeof error === "object" && error !== null ? (error as AxiosErrorShape) : undefined;

  // 1. Mensaje directo en data de la respuesta (Contrato ApiResponse: { codigo, mensaje, respuesta })
  const responseData = err?.response?.data;
  if (responseData) {
    if (typeof responseData === "string" && responseData.trim().length > 0) {
      return responseData;
    }

    if (typeof responseData === "object" && responseData !== null) {
      const dataObj = responseData as Record<string, unknown>;

      if (
        typeof dataObj.mensaje === "string" &&
        dataObj.mensaje.trim().length > 0
      ) {
        return dataObj.mensaje;
      }

      // Errores de validación ModelState de ASP.NET Core: { title, errors: { campo: ["error1"] } }
      if (dataObj.errors && typeof dataObj.errors === "object" && dataObj.errors !== null) {
        const errorList: string[] = [];
        const errorsMap = dataObj.errors as Record<string, unknown>;
        for (const key of Object.keys(errorsMap)) {
          const item = errorsMap[key];
          if (Array.isArray(item)) {
            errorList.push(...item.filter((x): x is string => typeof x === "string" && Boolean(x)));
          } else if (typeof item === "string") {
            errorList.push(item);
          }
        }
        if (errorList.length > 0) {
          return errorList.join(". ");
        }
      }

      if (
        typeof dataObj.title === "string" &&
        dataObj.title.trim().length > 0
      ) {
        return dataObj.title;
      }
    }
  }

  // 2. Códigos HTTP estándar de la respuesta
  const status = err?.response?.status;
  if (status) {
    switch (status) {
      case 400:
        return "Los datos enviados son inválidos. Por favor, revisa la información ingresada.";
      case 401:
        return "Tu sesión ha expirado o no es válida. Por favor, inicia sesión nuevamente.";
      case 403:
        return "No tienes permisos suficientes para realizar esta acción.";
      case 404:
        return "El recurso solicitado no fue encontrado o no está disponible.";
      case 409:
        return "Existe un conflicto con el estado actual del recurso.";
      case 429:
        return "Demasiadas solicitudes en poco tiempo. Por favor, espera unos momentos antes de reintentar.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "El servidor encontró un inconveniente temporal. Por favor, intenta de nuevo en unos momentos.";
    }
  }

  // 3. Errores de red y timeout
  if (
    err?.code === "ERR_NETWORK" ||
    (typeof err?.message === "string" &&
      err.message.toLowerCase().includes("network error"))
  ) {
    return "No fue posible conectar con el servidor. Por favor, verifica tu conexión a internet.";
  }

  if (
    err?.code === "ECONNABORTED" ||
    (typeof err?.message === "string" &&
      err.message.toLowerCase().includes("timeout"))
  ) {
    return "La solicitud tardó demasiado tiempo en responder. Por favor, intenta nuevamente.";
  }

  // 4. Mensaje directo en el error (Error estándar de JS)
  if (
    typeof err?.message === "string" &&
    err.message.trim().length > 0 &&
    !err.message.includes("[object Object]")
  ) {
    return err.message;
  }

  return fallback;
}

/**
 * Extrae información detallada y estructurada del error.
 */
export function extraerDetallesError(
  error: unknown,
  fallback?: string,
): ApiErrorInfo {
  const mensaje = extraerMensajeError(error, fallback);
  const err = typeof error === "object" && error !== null ? (error as AxiosErrorShape) : undefined;
  const responseData = err?.response?.data;
  const status = err?.response?.status;
  const dataObj = typeof responseData === "object" && responseData !== null ? (responseData as Record<string, unknown>) : undefined;

  const esErrorConexion =
    err?.code === "ERR_NETWORK" ||
    (typeof err?.message === "string" &&
      err.message.toLowerCase().includes("network error"));

  let detalles: string[] | undefined;
  if (dataObj?.errors && typeof dataObj.errors === "object" && dataObj.errors !== null) {
    detalles = [];
    const errorsMap = dataObj.errors as Record<string, unknown>;
    for (const key of Object.keys(errorsMap)) {
      const item = errorsMap[key];
      if (Array.isArray(item)) {
        detalles.push(...item.filter((x): x is string => typeof x === "string" && Boolean(x)));
      } else if (typeof item === "string") {
        detalles.push(item);
      }
    }
  }

  return {
    codigo: typeof dataObj?.codigo === "string" ? dataObj.codigo : undefined,
    mensaje,
    status,
    esErrorConexion,
    detalles,
  };
}
