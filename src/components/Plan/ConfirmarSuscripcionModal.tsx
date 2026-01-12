import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Divider,
  Box,
  Radio,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { PlanCreateDto } from "../../services/planApi";
import { useTarjetas } from "../../hooks/useTarjetas";
import { useSuscripciones } from "../../hooks/useSuscripciones";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: PlanCreateDto;
}

type Step = "confirmar" | "tarjeta" | "resumen";

interface Tarjeta {
  id: number;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  stripePaymentMethodId: string;
}

const primaryColor = "#6F4E37";
const bgColor = "#f5e9cf";

export const ConfirmarSuscripcionModal = ({ open, onClose, plan }: Props) => {
  const [step, setStep] = useState<Step>("confirmar");
  const [tarjetaSeleccionada, setTarjetaSeleccionada] =
    useState<Tarjeta | null>(null);

  const { tarjetas, listar, loading } = useTarjetas();
  const { contratar, loading: loadingSuscripcion } = useSuscripciones();

  useEffect(() => {
    if (open && step === "tarjeta") listar();
  }, [open, step, listar]);

  useEffect(() => {
    if (step === "tarjeta" && tarjetas.length && !tarjetaSeleccionada) {
      const tarjetaDefault = tarjetas.find(t => t.isDefault);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (tarjetaDefault) setTarjetaSeleccionada(tarjetaDefault);
    }
  }, [tarjetas, step, tarjetaSeleccionada]);

  const cerrar = () => {
    setStep("confirmar");
    setTarjetaSeleccionada(null);
    onClose();
  };

  const confirmarPago = async () => {
    if (!tarjetaSeleccionada) return;

    await contratar({
      planId: plan.id!,
      stripePaymentMethodId: tarjetaSeleccionada.stripePaymentMethodId,
    });

    cerrar();
  };

  const titulo =
    step === "confirmar"
      ? "Confirmar suscripción"
      : step === "tarjeta"
      ? "Selecciona un método de pago"
      : "Resumen del pago";

  return (
    <Dialog open={open} onClose={cerrar} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: primaryColor,
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {titulo}
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: bgColor, py: 3 }}>
        {/* PASO 1 */}
        {step === "confirmar" && (
          <Stack spacing={1.5}>
            <Typography variant="h6">{plan.nombre}</Typography>
            <Divider />
            <InfoRow label="Tipo" value={plan.tipo} />
            <InfoRow label="Duración" value={`${plan.duracionDias} días`} />
            <InfoRow label="Precio" value={`$${plan.precio}`} />

            <Typography color="text.secondary" mt={2}>
              Revisa la información y continúa para seleccionar tu método de pago.
            </Typography>
          </Stack>
        )}

        {/* PASO 2 */}
        {step === "tarjeta" && (
          <Stack spacing={2}>
            {loading && (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            )}

            {!loading && !tarjetas.length && (
              <Typography color="text.secondary">
                No tienes tarjetas registradas.
              </Typography>
            )}

            {!loading &&
              tarjetas.map(t => {
                const selected = tarjetaSeleccionada?.id === t.id;

                return (
                  <Box
                    key={t.id}
                    onClick={() => setTarjetaSeleccionada(t)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: selected
                        ? `2px solid ${primaryColor}`
                        : "1px solid #ddd",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      transition: "all .2s",
                      "&:hover": {
                        borderColor: primaryColor,
                      },
                    }}
                  >
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Typography fontWeight="bold">
                          **** **** **** {t.last4}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t.brand} · Exp {t.expMonth}/{t.expYear}
                          {t.isDefault && " · Principal"}
                        </Typography>
                      </Box>
                      <Radio checked={selected} sx={{ color: primaryColor }} />
                    </Box>
                  </Box>
                );
              })}
          </Stack>
        )}

        {/* PASO 3 */}
        {step === "resumen" && tarjetaSeleccionada && (
          <Stack spacing={2}>
            <Typography variant="h6">Resumen</Typography>
            <Divider />

            <Typography fontWeight="bold">{plan.nombre}</Typography>
            <Typography variant="body2" color="text.secondary">
              {plan.tipo} · {plan.duracionDias} días
            </Typography>

            <Divider />

            <Typography fontWeight="bold">Método de pago</Typography>
            <Typography variant="body2">
              **** **** **** {tarjetaSeleccionada.last4}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tarjetaSeleccionada.brand} · Exp {tarjetaSeleccionada.expMonth}/
              {tarjetaSeleccionada.expYear}
            </Typography>

            <Divider />

            <PriceRow label="Subtotal" value={plan.precio} />
            <PriceRow label="Total" value={plan.precio} bold />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ backgroundColor: bgColor, px: 3, pb: 2 }}>
        <Button onClick={cerrar} disabled={loadingSuscripcion}>
          Cancelar
        </Button>

        {step !== "resumen" && (
          <PrimaryButton
            onClick={() =>
              setStep(step === "confirmar" ? "tarjeta" : "resumen")
            }
            disabled={step === "tarjeta" && !tarjetaSeleccionada}
          >
            Continuar
          </PrimaryButton>
        )}

        {step === "resumen" && (
          <PrimaryButton onClick={confirmarPago} disabled={loadingSuscripcion}>
            {loadingSuscripcion ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Confirmar pago"
            )}
          </PrimaryButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

/* ================== COMPONENTES AUX ================== */

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Typography variant="body2">
    <strong>{label}:</strong> {value}
  </Typography>
);

const PriceRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) => (
  <Box display="flex" justifyContent="space-between">
    <Typography fontWeight={bold ? "bold" : "normal"}>{label}</Typography>
    <Typography fontWeight={bold ? "bold" : "normal"}>${value}</Typography>
  </Box>
);

const PrimaryButton = ({
  children,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    variant="contained"
    sx={{
      backgroundColor: primaryColor,
      px: 3,
      "&:hover": { backgroundColor: "#e8692c" },
    }}
    {...props}
  >
    {children}
  </Button>
);
