import {
  EstadoPagoPedido,
  EstadoPedido,
  type EstadoPagoPedido as EstadoPagoPedidoType,
} from "../../../types/User/pedidosComercio";

export const moneyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const estadoPedidoTexto: Record<number, string> = {
  [EstadoPedido.PendienteAprobacion]: "Pendiente de aprobación",
  [EstadoPedido.Aprobado]: "Aprobado",
  [EstadoPedido.Rechazado]: "Rechazado",
  [EstadoPedido.Preparando]: "Preparando",
  [EstadoPedido.ListoParaRecoger]: "Listo para recoger",
  [EstadoPedido.ListoParaEnviar]: "Listo para enviar",
  [EstadoPedido.Enviado]: "Enviado",
  [EstadoPedido.Entregado]: "Entregado",
  [EstadoPedido.Completado]: "Completado",
  [EstadoPedido.Cancelado]: "Cancelado",
};

export const estadoPagoTexto: Record<number, string> = {
  [EstadoPagoPedido.Pendiente]: "Pendiente",
  [EstadoPagoPedido.PendienteVerificacion]: "Verificar comprobante",
  [EstadoPagoPedido.Pagado]: "Pagado",
  [EstadoPagoPedido.Rechazado]: "Rechazado",
  [EstadoPagoPedido.Reembolsado]: "Reembolsado",
};

export const accionPedidoTexto: Record<number, string> = {
  [EstadoPedido.Aprobado]: "Aprobar",
  [EstadoPedido.Rechazado]: "Rechazar",
  [EstadoPedido.Preparando]: "Iniciar preparación",
  [EstadoPedido.ListoParaRecoger]: "Listo para recoger",
  [EstadoPedido.ListoParaEnviar]: "Listo para enviar",
  [EstadoPedido.Enviado]: "Marcar enviado",
  [EstadoPedido.Entregado]: "Marcar entregado",
  [EstadoPedido.Completado]: "Completar",
  [EstadoPedido.Cancelado]: "Cancelar",
};

export const colorEstadoPago = (estado: EstadoPagoPedidoType) => {
  if (estado === EstadoPagoPedido.Pagado) return "success" as const;
  if (estado === EstadoPagoPedido.PendienteVerificacion)
    return "warning" as const;
  if (estado === EstadoPagoPedido.Rechazado) return "error" as const;
  return "default" as const;
};
