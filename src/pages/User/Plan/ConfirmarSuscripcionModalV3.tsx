// ConfirmarSuscripcionModalV3.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
  CircularProgress,
  Radio,
  Divider,
  TextField,
  MenuItem,
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { PlanCreateDto } from "../../../services/planApi";
import { useTarjetas } from "../../../hooks/useTarjetas";
import { useCheckout } from "../../../hooks/useCheckout";
import { MetodoPagoStep } from "./MetodoPagoStep";
import Swal from "sweetalert2";

type MetodoPago = "guardada" | "nueva" | "transferencia" | "";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: PlanCreateDto;
  setIsSubSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConfirmarSuscripcionModalV3 = ({
  open,
  onClose,
  plan,
  setIsSubSuccess,
}: Props) => {
  const [metodo, setMetodo] = useState<MetodoPago>("");
  const [autoRenew, setAutoRenew] = useState<boolean>(false);
  const [banco, setBanco] = useState<string>("");
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<string | null>(
    null,
  );
  const [tarjetaPreSeleccionada, setTarjetaPreSeleccionada] = useState<
    number | null
  >(null);

  const { tarjetas, listar, loading: loadingTarjetas } = useTarjetas();
  const {
    loading: loadingCheckout,
    pagarConTarjetaGuardada,
    pagarConNuevaTarjeta,
  } = useCheckout();

  useEffect(() => {
    if (open && metodo === "guardada") listar();
  }, [open, metodo, listar]);

  useEffect(() => {
    if (tarjetas.length && tarjetaPreSeleccionada === null) {
      const def = tarjetas.find((t) => t.isDefault) ?? tarjetas[0];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTarjetaPreSeleccionada(def.id);
    }
  }, [tarjetas, tarjetaPreSeleccionada]);

  const cerrar = () => {
    setMetodo("");
    setTarjetaSeleccionada(null);
    setTarjetaPreSeleccionada(null);
    onClose();
  };

  const confirmarPago = async () => {
    if (!metodo) return;

    try {
      if (metodo === "guardada") {
        if (!tarjetaSeleccionada) {
          alert("Selecciona una tarjeta antes de confirmar");
          return;
        }
        const res = await pagarConTarjetaGuardada(
          Number(plan.id),
          tarjetaSeleccionada.toString(),
          autoRenew,
        );
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Pago realizado",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            confirmButtonText: "",
          });
          setIsSubSuccess(true);
          cerrar();
        }
      } else if (metodo === "nueva") {
        const res = await pagarConNuevaTarjeta(Number(plan.id));

        cerrar();
        window.open(String(res), "_blank");
      } else if (metodo === "transferencia") {
        // const res = await pagarPorTransferencia(Number(plan.id), banco);
        // if (res) {
        //   cerrar();
        //   Swal.fire({
        //     icon: "info",
        //     title: "Se abrirá la ventana de pago",
        //     text: "Completa tu transferencia en la nueva ventana",
        //     confirmButtonText: "Continuar al pago",
        //     allowOutsideClick: false,
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       window.open(String(res), "_blank");
        //     }
        //   });
        // }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al procesar el pago");
    }
  };

  const isLoading = loadingTarjetas || loadingCheckout;

  return (
    <Dialog
      open={open}
      onClose={cerrar}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 5,
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.95), rgba(245,245,247,.95))",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight={800}>
            Confirmar suscripción
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {plan.nombre} · {plan.tipo}
          </Typography>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: 4,
            background:
              "linear-gradient(135deg, rgba(0,0,0,.03), rgba(0,0,0,.01))",
          }}
        >
          <Stack spacing={1}>
            <Typography fontWeight={600}>{plan.nombre}</Typography>
            <Typography variant="body2" color="text.secondary">
              Tipo: {plan.tipo}
            </Typography>
            <Typography fontSize={20} fontWeight={800}>
              ${plan.precio.toLocaleString()}
            </Typography>
          </Stack>
        </Box>

        {/* MÉTODO DE PAGO */}
        {metodo === "" ? (
          <MetodoPagoStep onSelect={setMetodo} />
        ) : metodo === "guardada" ? (
          <Stack spacing={2}>
            {loadingTarjetas && (
              <Box py={5} display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            )}

            {!loadingTarjetas && !tarjetas.length && (
              <Typography color="text.secondary">
                No tienes tarjetas registradas
              </Typography>
            )}

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    Renovar automáticamente mi suscripción
                  </Typography>
                }
              />
            </FormGroup>

            {!loadingTarjetas &&
              tarjetas.map((t) => {
                const selected =
                  tarjetaSeleccionada === t.stripePaymentMethodId;
                const preSelected = tarjetaPreSeleccionada === t.id;

                return (
                  <Box
                    key={t.id}
                    onClick={() =>
                      setTarjetaSeleccionada(t.stripePaymentMethodId)
                    }
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      cursor: "pointer",
                      backgroundColor: selected ? "#fff" : "#fafafa",
                      border: selected
                        ? "2px solid #007AFF"
                        : "1px solid #e0e0e0",
                      boxShadow: selected
                        ? "0 12px 30px rgba(0,0,0,.15)"
                        : "0 4px 10px rgba(0,0,0,.05)",
                      transition: "all .25s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Typography fontWeight={700}>
                          •••• •••• •••• {t.last4}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t.brand} · Exp {t.expMonth}/{t.expYear}
                          {preSelected && " · Principal"}
                        </Typography>
                      </Box>
                      <Radio checked={selected} />
                    </Box>
                  </Box>
                );
              })}
          </Stack>
        ) : metodo === "nueva" ? (
          <Typography color="text.secondary">
            Serás redirigido a la pasarela de pago para completar tu suscripción
            💳
          </Typography>
        ) : (
          <>
            <Card
              sx={{
                p: 2,
                borderRadius: 4,
                background: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <Typography fontSize={13} color="text.secondary" mb={1}>
                Banco para transferencia 🏦
              </Typography>

              <TextField
                select
                fullWidth
                size="small"
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              >
                <MenuItem value="bbva">BBVA</MenuItem>
                <MenuItem value="banamex">Citibanamex</MenuItem>
                <MenuItem value="santander">Santander</MenuItem>
                <MenuItem value="banorte">Banorte</MenuItem>
                <MenuItem value="hsbc">HSBC</MenuItem>
                <MenuItem value="azteca">Banco Azteca</MenuItem>
                <MenuItem value="oxxo">OXXO</MenuItem>
              </TextField>
            </Card>
          </>
        )}
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={cerrar} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>

        {metodo && (metodo !== "guardada" || tarjetaSeleccionada) && (
          <Button
            variant="contained"
            onClick={confirmarPago}
            disabled={isLoading}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 4,
              background: "linear-gradient(135deg, #007AFF, #005BBB)",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 10px 25px rgba(0,122,255,.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #005BBB, #004799)",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Confirmar pago"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
