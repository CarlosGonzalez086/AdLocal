import { Button, CircularProgress } from "@mui/material";
import { GenericModal } from "../../../../components/GenericModal";
import { EstadoPagoPedido } from "../../../../types/User/pedidosComercio";

interface Props {
  open: boolean;
  loading: boolean;
  comprobanteUrl: string | null;
  numeroPedido?: string;
  estadoPago?: number;
  onClose: () => void;
  onAprobar: () => void;
  onRechazar: () => void;
}

export const ComprobantePedidoModal = ({
  open,
  loading,
  comprobanteUrl,
  numeroPedido,
  estadoPago,
  onClose,
  onAprobar,
  onRechazar,
}: Props) => (
  <GenericModal
    open={open}
    onClose={onClose}
    title="Comprobante de transferencia"
    subtitle={numeroPedido}
    icon="fact_check"
    maxWidth="lg"
    hideActions
  >
    {loading ? (
      <div className="d-flex align-items-center justify-content-center py-5">
        <CircularProgress />
      </div>
    ) : (
      comprobanteUrl && (
        <div className="mt-4">
          <div className="ratio ratio-16x9 pedidosReceiptFrame">
            <iframe src={comprobanteUrl} title="Comprobante de transferencia" />
          </div>

          {estadoPago === EstadoPagoPedido.PendienteVerificacion && (
            <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap mt-3">
              <Button
                type="button"
                color="error"
                variant="outlined"
                className="btn-adlocal fz-h5 fw-semibold"
                onClick={onRechazar}
              >
                Rechazar
              </Button>
              <Button
                type="button"
                color="success"
                variant="contained"
                className="btn-adlocal btn-adlocal--solid fz-h5 fw-semibold"
                onClick={onAprobar}
              >
                Aprobar pago
              </Button>
            </div>
          )}
        </div>
      )
    )}
  </GenericModal>
);
