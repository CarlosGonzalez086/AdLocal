import {
  Dialog,
  DialogContent,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect, useRef } from "react";
import type { CrearTarjetaDto, TarjetaDto } from "../../services/tarjetaApi";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CrearTarjetaDto) => Promise<void>;
  loading?: boolean;
  tarjeta?: TarjetaDto | null;
}

export const TarjetaModal = ({ open, onClose, onSave, loading, tarjeta }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isDefault, setIsDefault] = useState(false);
  const [changingCard, setChangingCard] = useState(false);
  const [saving, setSaving] = useState(false);
  const confirmingRef = useRef(false);

  useEffect(() => {
    setIsDefault(tarjeta?.isDefault ?? false);
    setChangingCard(false);
  }, [tarjeta, open]);

  const crearTarjetaConSetupIntent = async (): Promise<string | null> => {
    if (!stripe || !elements) return null;
    if (confirmingRef.current) return null;
    confirmingRef.current = true;

    try {
      const card = elements.getElement(CardElement);
      if (!card) return null;

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/stripe/setup-intent`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) { alert("No se pudo iniciar el registro de la tarjeta"); return null; }

      const { clientSecret } = await resp.json();
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card },
      });

      if (result.error) { alert(result.error.message); return null; }
      return result.setupIntent?.payment_method as string;
    } finally {
      confirmingRef.current = false;
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      let pmId: string | null = tarjeta?.stripePaymentMethodId ?? null;
      if (!pmId || changingCard) {
        const newPmId = await crearTarjetaConSetupIntent();
        if (!newPmId) return;
        pmId = newPmId;
      }
      await onSave({ paymentMethodId: pmId, isDefault });
      elements?.getElement(CardElement)?.clear();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isBusy = loading || saving || !stripe;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 3,
              bgcolor: "rgba(0,122,255,0.10)",
              border: "1px solid rgba(0,122,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreditCardRoundedIcon sx={{ fontSize: 20, color: "#007AFF" }} />
          </Box>
          <Box>
            <Typography fontWeight={800} fontSize="1.05rem" letterSpacing="-0.2px">
              {tarjeta ? "Editar tarjeta" : "Agregar tarjeta"}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <LockRoundedIcon sx={{ fontSize: 11, color: "text.disabled" }} />
              <Typography fontSize="0.72rem" color="text.disabled">
                Pago seguro con Stripe
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            width: 32, height: 32, borderRadius: 999,
            bgcolor: "rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.09)" },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>

        {/* TARJETA EXISTENTE */}
        {tarjeta && !changingCard && (
          <Box
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg, #1C1C1E, #3A3A3C)",
              color: "#fff",
              boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -40,
                right: -40,
                width: 140,
                height: 140,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.04)",
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
              <Typography fontWeight={800} fontSize="0.95rem" letterSpacing="0.05em">
                {tarjeta.brand.toUpperCase()}
              </Typography>

              {tarjeta.isDefault && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  <Typography fontSize="0.7rem" fontWeight={700} color="#fff">
                    Principal
                  </Typography>
                </Box>
              )}
            </Stack>

            <Typography sx={{ letterSpacing: 4, fontSize: "1rem", fontFamily: "monospace" }}>
              •••• •••• •••• {tarjeta.last4}
            </Typography>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2.5}>
              <Typography fontSize="0.8rem" sx={{ opacity: 0.7 }}>
                Exp: {tarjeta.expMonth.toString().padStart(2, "0")}/{tarjeta.expYear}
              </Typography>
              <Button
                size="small"
                onClick={() => setChangingCard(true)}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.30)",
                  px: 1.5,
                  py: 0.4,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.10)" },
                }}
              >
                Cambiar
              </Button>
            </Stack>
          </Box>
        )}

        {/* NUEVA TARJETA */}
        {(!tarjeta || changingCard) && (
          <Box
            sx={{
              mb: 3,
              px: 2.5,
              py: 2,
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid rgba(0,0,0,0.10)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              transition: "all 0.2s ease",
              "&:focus-within": {
                borderColor: "#007AFF",
                boxShadow: "0 0 0 3px rgba(0,122,255,0.12)",
              },
            }}
          >
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "16px",
                    fontWeight: "500",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                    color: "#1C1C1E",
                    letterSpacing: "0.4px",
                    "::placeholder": { color: "#8E8E93", fontWeight: "400" },
                    iconColor: "#007AFF",
                  },
                  invalid: { color: "#FF3B30", iconColor: "#FF3B30" },
                  complete: { color: "#34C759", iconColor: "#34C759" },
                },
              }}
            />
          </Box>
        )}

        <Divider sx={{ opacity: 0.5, mb: 2 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              sx={{
                color: "rgba(0,0,0,0.25)",
                "&.Mui-checked": { color: "#007AFF" },
              }}
            />
          }
          label={
            <Typography fontSize="0.875rem" fontWeight={500} color="text.secondary">
              Establecer como tarjeta principal
            </Typography>
          }
        />
      </DialogContent>

      {/* FOOTER */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          mt: 1,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            border: "1px solid rgba(0,0,0,0.15)",
            color: "text.secondary",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isBusy}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 700,
            px: 4,
            py: 1.1,
            background: "linear-gradient(135deg, #007AFF, #005FCC)",
            boxShadow: "0 6px 18px rgba(0,122,255,0.30)",
            transition: "all 0.25s ease",
            "&:hover": {
              boxShadow: "0 10px 24px rgba(0,122,255,0.42)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "scale(0.98)" },
            "&:disabled": { opacity: 0.6 },
          }}
        >
          {isBusy
            ? <CircularProgress size={18} thickness={4} sx={{ color: "#fff" }} />
            : "Guardar"
          }
        </Button>
      </Box>
    </Dialog>
  );
};