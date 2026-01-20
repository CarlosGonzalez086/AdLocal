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
  Fade,
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

const colors = {
  primary: "#6F4E37",
  bg: "#f7f8fa",
  card: "#ffffff",
};

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
      const def = tarjetas.find((t) => t.isDefault);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (def) setTarjetaSeleccionada(def);
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
        ? "Método de pago"
        : "Resumen";

  return (
    <Dialog
      open={open}
      onClose={cerrar}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, overflow: "hidden" },
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>
          {titulo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {plan.nombre}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ backgroundColor: colors.bg, py: 3 }}>
        <Fade in>
          <Box>
            {step === "confirmar" && (
              <Stack spacing={2}>
                <InfoRow label="Tipo" value={plan.tipo} />
                <InfoRow label="Duración" value={`${plan.duracionDias} días`} />
                <InfoRow label="Precio" value={`$${plan.precio}`} />

                <Typography variant="body2" color="text.secondary">
                  Continúa para seleccionar tu método de pago.
                </Typography>
              </Stack>
            )}

            {step === "tarjeta" && (
              <Stack spacing={2}>
                {loading && (
                  <Box py={4} display="flex" justifyContent="center">
                    <CircularProgress />
                  </Box>
                )}

                {!loading && !tarjetas.length && (
                  <Typography color="text.secondary">
                    No tienes tarjetas registradas.
                  </Typography>
                )}

                {!loading &&
                  tarjetas.map((t) => {
                    const selected = tarjetaSeleccionada?.id === t.id;

                    return (
                      <Box
                        key={t.id}
                        onClick={() => setTarjetaSeleccionada(t)}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          backgroundColor: colors.card,
                          border: selected
                            ? `2px solid ${colors.primary}`
                            : "1px solid #e0e0e0",
                          cursor: "pointer",
                          boxShadow: selected
                            ? "0 8px 24px rgba(0,0,0,0.12)"
                            : "0 2px 6px rgba(0,0,0,0.05)",
                          transition: "all .25s",
                        }}
                      >
                        <Box display="flex" justifyContent="space-between">
                          <Box>
                            <Typography fontWeight={700}>
                              •••• •••• •••• {t.last4}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t.brand} · Exp {t.expMonth}/{t.expYear}
                              {t.isDefault && " · Principal"}
                            </Typography>
                          </Box>
                          <Radio checked={selected} />
                        </Box>
                      </Box>
                    );
                  })}
              </Stack>
            )}

            {step === "resumen" && tarjetaSeleccionada && (
              <Stack spacing={2}>
                <Typography fontWeight={700}>Plan</Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.nombre} · {plan.tipo}
                </Typography>

                <Divider />

                <Typography fontWeight={700}>Pago</Typography>
                <Typography variant="body2">
                  •••• {tarjetaSeleccionada.last4}
                </Typography>

                <Divider />

                <PriceRow label="Total" value={plan.precio} bold />
              </Stack>
            )}
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
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
    <Typography fontWeight={bold ? 700 : 400}>{label}</Typography>
    <Typography fontWeight={bold ? 700 : 400}>
      ${value.toLocaleString()}
    </Typography>
  </Box>
);

const PrimaryButton = ({
  children,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    variant="contained"
    sx={{
      px: 3,
      borderRadius: 3,
      backgroundColor: colors.primary,
      textTransform: "none",
      fontWeight: 600,
      "&:hover": {
        backgroundColor: "#5c3f2d",
      },
    }}
    {...props}
  >
    {children}
  </Button>
);
