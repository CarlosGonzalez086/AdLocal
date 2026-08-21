import { Alert, Button, Chip, CircularProgress } from "@mui/material";
import { GenericModal } from "../../../../components/GenericModal";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import {
  EstadoPagoPedido,
  EstadoPedido,
  MetodoPagoPedido,
  TipoEntregaPedido,
  type EstadoPagoPedido as EstadoPagoPedidoType,
  type EstadoPedido as EstadoPedidoType,
  type PedidoComercioDetalleDto,
} from "../../../../types/User/pedidosComercio";
import {
  accionPedidoTexto,
  colorEstadoPago,
  dateFormatter,
  estadoPagoTexto,
  estadoPedidoTexto,
  moneyFormatter,
} from "../pedidoComercioPresentation";

interface Props {
  pedido: PedidoComercioDetalleDto | null;
  loading: boolean;
  onClose: () => void;
  onCambiarEstado: (estado: EstadoPedidoType) => void;
  onRevisarComprobante: () => void;
  onCambiarPago: (estado: EstadoPagoPedidoType) => void;
}

export const PedidoDetalleModal = ({
  pedido,
  loading,
  onClose,
  onCambiarEstado,
  onRevisarComprobante,
  onCambiarPago,
}: Props) => (
  <GenericModal
    open={Boolean(pedido)}
    onClose={onClose}
    title={pedido?.numeroPedido ?? "Pedido"}
    subtitle={pedido?.clienteNombre}
    icon="receipt_long"
    maxWidth="lg"
    hideActions
  >
    {loading || !pedido ? (
      <div className="d-flex align-items-center justify-content-center py-5">
        <CircularProgress />
      </div>
    ) : (
      <div className="mt-4">
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="pedidosDetailCard h-100 p-3 d-flex flex-column gap-1">
              <span className="fz-h6 fw-medium">Compró</span>
              <strong className="fz-h4 fw-semibold">
                {pedido.clienteNombre}
              </strong>
              <small className="fz-h6 fw-regular">{pedido.clienteEmail}</small>
              <small className="fz-h6 fw-regular">
                {pedido.telefonoEntrega}
              </small>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="pedidosDetailCard h-100 p-3 d-flex flex-column gap-1">
              <span className="fz-h6 fw-medium">Entrega</span>
              <strong className="fz-h4 fw-semibold">
                {pedido.tipoEntrega === TipoEntregaPedido.Domicilio
                  ? "Domicilio"
                  : "Recoger"}
              </strong>
              <small className="fz-h6 fw-regular">{pedido.direccion}</small>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="pedidosDetailCard h-100 p-3 d-flex flex-column gap-1">
              <span className="fz-h6 fw-medium">Total</span>
              <strong className="fz-h3 fw-bold">
                {moneyFormatter.format(pedido.total)}
              </strong>
              <Chip
                size="small"
                color={colorEstadoPago(pedido.estadoPago)}
                label={estadoPagoTexto[pedido.estadoPago]}
              />
            </div>
          </div>
        </div>

        {pedido.metodoPago === MetodoPagoPedido.Transferencia &&
          pedido.tieneComprobante && (
            <Alert
              severity={
                pedido.estadoPago === EstadoPagoPedido.PendienteVerificacion
                  ? "warning"
                  : "info"
              }
              className="my-3"
              action={
                <Button
                  type="button"
                  className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm fz-h5 fw-semibold"
                  onClick={onRevisarComprobante}
                >
                  Revisar comprobante
                </Button>
              }
            >
              Pago por transferencia · {estadoPagoTexto[pedido.estadoPago]}
            </Alert>
          )}

        <h3 className="fz-h3 fw-semibold mb-3">Productos</h3>

        <div className="d-flex flex-column gap-2 mb-4">
          {pedido.productos.map((producto) => (
            <div
              key={producto.uuid}
              className="pedidosProduct row g-3 align-items-center p-2 mx-0"
            >
              <div className="col-3 col-sm-2 col-md-1">
                <div className="pedidosProductImage ratio ratio-1x1 d-flex align-items-center justify-content-center overflow-hidden">
                  {producto.logoUrl ? (
                    <img
                      src={producto.logoUrl}
                      alt=""
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <MaterialSymbol icon="inventory_2" size="medium" />
                  )}
                </div>
              </div>
              <span className="col d-flex flex-column">
                <strong className="fz-h5 fw-semibold">{producto.nombre}</strong>
                <small className="fz-h6 fw-regular">
                  {producto.cantidad} ×{" "}
                  {moneyFormatter.format(producto.precioUnitario)}
                </small>
              </span>
              <strong className="col-auto fz-h5 fw-semibold">
                {moneyFormatter.format(producto.subtotal)}
              </strong>
            </div>
          ))}
        </div>

        {pedido.observacionesCliente && (
          <Alert severity="info">
            Observaciones: {pedido.observacionesCliente}
          </Alert>
        )}

        <div className="pedidosActions d-flex justify-content-end align-items-center gap-2 flex-wrap py-3 my-4">
          {pedido.metodoPago === MetodoPagoPedido.Efectivo &&
            pedido.estadoPago === EstadoPagoPedido.Pendiente && (
              <Button
                type="button"
                color="success"
                variant="outlined"
                className="btn-adlocal fz-h5 fw-semibold"
                onClick={() => onCambiarPago(EstadoPagoPedido.Pagado)}
              >
                Marcar efectivo recibido
              </Button>
            )}

          {pedido.accionesDisponibles.map((estado) => (
            <Button
              type="button"
              key={estado}
              color={
                estado === EstadoPedido.Rechazado ||
                estado === EstadoPedido.Cancelado
                  ? "error"
                  : "primary"
              }
              variant="contained"
              className="btn-adlocal btn-adlocal--solid fz-h5 fw-semibold"
              onClick={() => onCambiarEstado(estado)}
            >
              {accionPedidoTexto[estado]}
            </Button>
          ))}
        </div>

        <h3 className="fz-h3 fw-semibold mb-3">Historial</h3>

        <div className="d-flex flex-column">
          {pedido.historial.map((historial, index) => (
            <div
              key={`${historial.fecha}-${index}`}
              className="pedidosTimelineItem d-flex flex-column ps-3 pb-3"
            >
              <strong className="fz-h5 fw-semibold">
                {estadoPedidoTexto[historial.estado]}
              </strong>
              <small className="fz-h6 fw-regular">
                {dateFormatter.format(new Date(historial.fecha))}
              </small>
              {/* {historial.comentario && (
                <span className="fz-h6 fw-regular">{historial.comentario}</span>
              )} */}
            </div>
          ))}
        </div>
      </div>
    )}
  </GenericModal>
);
