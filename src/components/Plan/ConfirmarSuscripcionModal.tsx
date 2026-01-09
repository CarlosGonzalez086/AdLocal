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

export const ConfirmarSuscripcionModal = ({ open, onClose, plan }: Props) => {
  const [step, setStep] = useState<Step>("confirmar");
  const [tarjetaSeleccionada, setTarjetaSeleccionada] =
    useState<Tarjeta | null>(null);

  const { tarjetas, listar, loading } = useTarjetas();
  const { contratar, loading: loadingSuscripcion } = useSuscripciones();

  useEffect(() => {
    if (open && step === "tarjeta") {
      listar();
    }
  }, [open, step, listar]);

  useEffect(() => {
    if (step === "tarjeta" && tarjetas.length && !tarjetaSeleccionada) {
      const tarjetaDefault = tarjetas.find((t: Tarjeta) => t.isDefault);
      if (tarjetaDefault) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTarjetaSeleccionada(tarjetaDefault);
      }
    }
  }, [tarjetas, step, tarjetaSeleccionada]);

  const cerrar = () => {
    setStep("confirmar");
    setTarjetaSeleccionada(null);
    onClose();
  };

  const confirmarPago = async () => {
    if (!tarjetaSeleccionada) return;

    try {
      await contratar({
        planId: plan.id!,
        stripePaymentMethodId: tarjetaSeleccionada.stripePaymentMethodId,
      });

      cerrar();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={cerrar} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#6F4E37", color: "#fff" }}>
        {step === "confirmar"
          ? "Confirmar suscripción"
          : step === "tarjeta"
          ? "Selecciona método de pago"
          : "Resumen del pago"}
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "#f5e9cf" }}>
        {/* PASO 1: CONFIRMAR */}
        {step === "confirmar" && (
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {plan.nombre}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Typography variant="body2">
              <strong>Tipo:</strong> {plan.tipo}
            </Typography>
            <Typography variant="body2">
              <strong>Duración:</strong> {plan.duracionDias} días
            </Typography>
            <Typography variant="body2">
              <strong>Precio:</strong> ${plan.precio}
            </Typography>

            <Typography sx={{ mt: 2 }} color="text.secondary">
              Confirma para continuar con el pago
            </Typography>
          </Box>
        )}

        {/* PASO 2: TARJETA */}
        {step === "tarjeta" && (
          <Box mt={2}>
            {loading && (
              <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress />
              </Box>
            )}

            {!loading && !tarjetas.length && (
              <Typography color="text.secondary">
                No tienes tarjetas registradas
              </Typography>
            )}

            {!loading &&
              tarjetas.map((t: Tarjeta) => {
                const selected = tarjetaSeleccionada?.id === t.id;

                return (
                  <Box
                    key={t.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                    mb={1}
                    borderRadius={2}
                    sx={{
                      backgroundColor: "#fff",
                      border: selected ? "2px solid #6F4E37" : "1px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={() => setTarjetaSeleccionada(t)}
                  >
                    <Box>
                      <Typography fontWeight="bold">
                        **** **** **** {t.last4}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t.brand} · Exp {t.expMonth}/{t.expYear}
                        {t.isDefault && " · Principal"}
                      </Typography>
                    </Box>

                    <Radio
                      checked={selected}
                      sx={{
                        color: "#6F4E37",
                        "&.Mui-checked": {
                          color: "#6F4E37",
                        },
                      }}
                    />
                  </Box>
                );
              })}
          </Box>
        )}

        {/* PASO 3: RESUMEN */}
        {step === "resumen" && tarjetaSeleccionada && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight="bold">
              Resumen del pago
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight="bold">{plan.nombre}</Typography>
            <Typography variant="body2">
              {plan.tipo} · {plan.duracionDias} días
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight="bold">Método de pago</Typography>
            <Typography variant="body2">
              **** **** **** {tarjetaSeleccionada.last4}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tarjetaSeleccionada.brand} · Exp {tarjetaSeleccionada.expMonth}/
              {tarjetaSeleccionada.expYear}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Typography>Subtotal</Typography>
              <Typography>${plan.precio}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold">${plan.precio}</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ backgroundColor: "#f5e9cf", px: 3, pb: 2 }}>
        <Button onClick={cerrar} disabled={loadingSuscripcion}>
          Cancelar
        </Button>

        {step === "confirmar" && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6F4E37",
              "&:hover": { backgroundColor: "#e8692c" },
            }}
            onClick={() => setStep("tarjeta")}
          >
            Siguiente
          </Button>
        )}

        {step === "tarjeta" && (
          <Button
            variant="contained"
            disabled={!tarjetaSeleccionada}
            sx={{
              backgroundColor: "#6F4E37",
              "&:hover": { backgroundColor: "#e8692c" },
            }}
            onClick={() => setStep("resumen")}
          >
            Siguiente
          </Button>
        )}

        {step === "resumen" && (
          <Button
            variant="contained"
            disabled={loadingSuscripcion}
            sx={{
              backgroundColor: "#6F4E37",
              "&:hover": { backgroundColor: "#e8692c" },
            }}
            onClick={confirmarPago}
          >
            {loadingSuscripcion ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Confirmar pago"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
