import {
  Dialog,
  DialogContent,
  Button,
  Stack,
  Typography,
  Box,
  CircularProgress,
  Radio,
  Divider,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { PlanCreateDto } from "../../../services/planApi";
import { useTarjetas } from "../../../hooks/useTarjetas";
import { useCheckout } from "../../../hooks/useCheckout";
import { MetodoPagoStep } from "./MetodoPagoStep";
import Swal from "sweetalert2";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

type MetodoPago = "guardada" | "nueva" | "transferencia" | "";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: PlanCreateDto;
  setIsSubSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const PLAN_GRADIENT: Record<string, string> = {
  BASIC:    "linear-gradient(135deg, #007AFF, #005FCC)",
  PRO:      "linear-gradient(135deg, #5856D6, #3634A3)",
  BUSINESS: "linear-gradient(135deg, #FF9500, #CC7700)",
  FREE:     "linear-gradient(135deg, #8e8e93, #636366)",
};

export const ConfirmarSuscripcionModalV3 = ({ open, onClose, plan, setIsSubSuccess }: Props) => {
  const [metodo, setMetodo] = useState<MetodoPago>("");
  const [autoRenew, setAutoRenew] = useState(false);
  const [banco, setBanco] = useState("");
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<string | null>(null);
  const [tarjetaPreSeleccionada, setTarjetaPreSeleccionada] = useState<number | null>(null);

  const { tarjetas, listar, loading: loadingTarjetas } = useTarjetas();
  const { loading: loadingCheckout, pagarConTarjetaGuardada, pagarConNuevaTarjeta } = useCheckout();

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
        if (!tarjetaSeleccionada) { alert("Selecciona una tarjeta antes de confirmar"); return; }
        const res = await pagarConTarjetaGuardada(Number(plan.id), tarjetaSeleccionada.toString(), autoRenew);
        if (res) {
          Swal.fire({ icon: "success", title: "Pago realizado", showConfirmButton: false, timer: 2000, timerProgressBar: true });
          setIsSubSuccess(true);
          cerrar();
        }
      } else if (metodo === "nueva") {
        const res = await pagarConNuevaTarjeta(Number(plan.id));
        cerrar();
        window.open(String(res), "_blank");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al procesar el pago");
    }
  };

  const isLoading = loadingTarjetas || loadingCheckout;
  const planGradient = PLAN_GRADIENT[plan.tipo] ?? PLAN_GRADIENT.FREE;
  const canConfirm = metodo && (metodo !== "guardada" || tarjetaSeleccionada);

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
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2.5,
          background: planGradient,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -40, right: -40,
            width: 150, height: 150,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.07)",
          },
        }}
      >
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Stack spacing={0.3}>
            <Typography fontWeight={800} fontSize="1.15rem" color="#fff" letterSpacing="-0.3px">
              Confirmar suscripción
            </Typography>
            <Typography fontSize="0.78rem" sx={{ color: "rgba(255,255,255,0.72)" }}>
              {plan.nombre} · {plan.tipo}
            </Typography>
          </Stack>
          <IconButton
            onClick={cerrar}
            size="small"
            sx={{
              width: 30, height: 30, borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.18)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16, color: "#fff" }} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>

        {/* RESUMEN DEL PLAN */}
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: 4,
            bgcolor: "rgba(0,0,0,0.03)",
            border: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography fontWeight={700} fontSize="0.9rem">{plan.nombre}</Typography>
            <Typography fontSize="0.75rem" color="text.disabled" mt={0.2}>Plan {plan.tipo}</Typography>
          </Box>
          <Typography
            fontWeight={900}
            fontSize="1.4rem"
            sx={{ background: planGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            ${plan.precio.toLocaleString()}
            <Typography component="span" fontSize="0.75rem" fontWeight={500} sx={{ WebkitTextFillColor: "#8e8e93", ml: 0.4 }}>
              MXN
            </Typography>
          </Typography>
        </Box>

        <Divider sx={{ mb: 2.5, opacity: 0.5 }} />

        {/* MÉTODO DE PAGO */}
        {metodo === "" && <MetodoPagoStep onSelect={setMetodo} />}

        {metodo === "guardada" && (
          <Stack spacing={2}>
            {loadingTarjetas ? (
              <Box py={5} display="flex" justifyContent="center">
                <CircularProgress size={28} thickness={4} sx={{ color: "#007AFF" }} />
              </Box>
            ) : !tarjetas.length ? (
              <Box
                sx={{
                  py: 4, textAlign: "center",
                  borderRadius: 4, bgcolor: "rgba(0,0,0,0.03)",
                  border: "1px dashed rgba(0,0,0,0.10)",
                }}
              >
                <CreditCardRoundedIcon sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
                <Typography fontSize="0.875rem" color="text.disabled">
                  No tienes tarjetas registradas
                </Typography>
              </Box>
            ) : (
              tarjetas.map((t) => {
                const selected = tarjetaSeleccionada === t.stripePaymentMethodId;
                return (
                  <Box
                    key={t.id}
                    onClick={() => setTarjetaSeleccionada(t.stripePaymentMethodId)}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      cursor: "pointer",
                      bgcolor: selected ? "#fff" : "rgba(0,0,0,0.02)",
                      border: selected ? "1.5px solid #007AFF" : "1px solid rgba(0,0,0,0.08)",
                      boxShadow: selected ? "0 6px 20px rgba(0,122,255,0.15)" : "none",
                      transition: "all .22s ease",
                      "&:hover": { transform: "translateY(-2px)" },
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography fontWeight={700} fontSize="0.9rem" fontFamily="monospace" letterSpacing={2}>
                          •••• •••• •••• {t.last4}
                        </Typography>
                        <Typography fontSize="0.75rem" color="text.disabled" mt={0.3}>
                          {t.brand} · Exp {t.expMonth}/{t.expYear}
                          {tarjetaPreSeleccionada === t.id && " · Principal"}
                        </Typography>
                      </Box>
                      <Radio
                        checked={selected}
                        sx={{ "&.Mui-checked": { color: "#007AFF" } }}
                      />
                    </Box>
                  </Box>
                );
              })
            )}

            <Box
              sx={{
                px: 2, py: 1.5,
                borderRadius: 3,
                bgcolor: "rgba(0,122,255,0.05)",
                border: "1px solid rgba(0,122,255,0.12)",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                    sx={{ "&.Mui-checked": { color: "#007AFF" } }}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AutorenewRoundedIcon sx={{ fontSize: 16, color: autoRenew ? "#007AFF" : "text.disabled" }} />
                    <Typography fontSize="0.82rem" fontWeight={500} color="text.secondary">
                      Renovar automáticamente mi suscripción
                    </Typography>
                  </Stack>
                }
              />
            </Box>
          </Stack>
        )}

        {metodo === "nueva" && (
          <Box
            sx={{
              p: 2.5, borderRadius: 4,
              bgcolor: "rgba(0,122,255,0.05)",
              border: "1px solid rgba(0,122,255,0.12)",
              display: "flex", alignItems: "center", gap: 1.5,
            }}
          >
            <CreditCardRoundedIcon sx={{ fontSize: 22, color: "#007AFF", flexShrink: 0 }} />
            <Typography fontSize="0.875rem" color="text.secondary" lineHeight={1.5}>
              Serás redirigido a la pasarela de pago seguro para completar tu suscripción.
            </Typography>
          </Box>
        )}

        {metodo === "transferencia" && (
          <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <Typography fontSize="0.78rem" fontWeight={700} color="text.disabled" letterSpacing="0.06em" textTransform="uppercase" mb={1.5}>
              🏦 Banco para transferencia
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={banco}
              onChange={(e) => setBanco(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#fff",
                  "& fieldset": { borderColor: "#E0E0E0" },
                  "&.Mui-focused fieldset": { borderColor: "#007AFF" },
                },
              }}
            >
              {["BBVA","Citibanamex","Santander","Banorte","HSBC","Banco Azteca","OXXO"].map((b) => (
                <MenuItem key={b} value={b.toLowerCase()}>{b}</MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </DialogContent>

      {/* FOOTER */}
      <Box
        sx={{
          px: 3, py: 2.5, mt: 1,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex", justifyContent: "flex-end", gap: 1.5,
        }}
      >
        <Button
          onClick={cerrar}
          sx={{
            borderRadius: 999, textTransform: "none", fontWeight: 600, px: 3,
            border: "1px solid rgba(0,0,0,0.15)", color: "text.secondary",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          Cancelar
        </Button>

        {canConfirm && (
          <Button
            variant="contained"
            onClick={confirmarPago}
            disabled={isLoading}
            sx={{
              borderRadius: 999, textTransform: "none", fontWeight: 700,
              px: 4, py: 1.1,
              background: planGradient,
              boxShadow: "0 6px 18px rgba(0,122,255,0.30)",
              transition: "all 0.25s ease",
              "&:hover": { boxShadow: "0 10px 24px rgba(0,122,255,0.42)", transform: "translateY(-1px)" },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            {isLoading
              ? <CircularProgress size={18} thickness={4} sx={{ color: "#fff" }} />
              : "Confirmar pago"
            }
          </Button>
        )}
      </Box>
    </Dialog>
  );
};