import {
  Dialog,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import type { CrearTarjetaDto, TarjetaDto } from "../../services/tarjetaApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CrearTarjetaDto) => Promise<void>;
  loading?: boolean;
  tarjeta?: TarjetaDto | null;
}

const iosColors = {
  primary: "#007AFF",
  primaryDark: "#005FCC",
  background: "#F5F5F7",
};

export const TarjetaModal = ({
  open,
  onClose,
  onSave,
  loading,
  tarjeta,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isDefault, setIsDefault] = useState(false);
  const [changingCard, setChangingCard] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsDefault(tarjeta?.isDefault ?? false);
    setChangingCard(false);
  }, [tarjeta, open]);

  // 🔥 SETUP INTENT (FORMA CORRECTA EN LIVE)
  const crearTarjetaConSetupIntent = async (): Promise<string | null> => {
    if (!stripe || !elements) return null;

    const card = elements.getElement(CardElement);
    if (!card) return null;

    // 1️⃣ Obtener clientSecret desde backend
    const resp = await fetch(
      `${import.meta.env.VITE_API_URL}/stripe/setup-intent`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!resp.ok) {
      alert("No se pudo iniciar el registro de la tarjeta");
      return null;
    }

    const { clientSecret } = await resp.json();

    // 2️⃣ Confirmar tarjeta con Stripe
    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      alert(result.error.message);
      return null;
    }

    // 3️⃣ PaymentMethod REAL y válido en LIVE
    return result.setupIntent.payment_method as string;
  };

  // 🔹 GUARDAR
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      let pmId: string | null = tarjeta?.stripePaymentMethodId ?? null;

      // Si es nueva o se está cambiando
      if (!pmId || changingCard) {
        const newPmId = await crearTarjetaConSetupIntent();
        if (!newPmId) return;
        pmId = newPmId;
      }

      await onSave({
        paymentMethodId: pmId,
        isDefault,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: iosColors.background,
        },
      }}
    >
      <Box px={4} pt={4} pb={2}>
        <Typography variant="h5" fontWeight={700}>
          {tarjeta ? "Editar tarjeta" : "Agregar tarjeta"}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Pago seguro con Stripe
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* 💳 Tarjeta existente */}
        {tarjeta && !changingCard && (
          <Box
            mb={3}
            p={3}
            borderRadius={4}
            sx={{
              background: "linear-gradient(135deg, #1C1C1E 0%, #3A3A3C 100%)",
              color: "#fff",
            }}
          >
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography fontWeight={700}>
                {tarjeta.brand.toUpperCase()}
              </Typography>

              {tarjeta.isDefault && (
                <Box
                  px={1.5}
                  py={0.5}
                  borderRadius={2}
                  bgcolor="#fff"
                  color="#000"
                  fontWeight={700}
                  fontSize="0.75rem"
                >
                  Principal
                </Box>
              )}
            </Stack>

            <Typography sx={{ letterSpacing: 3 }}>
              •••• •••• •••• {tarjeta.last4}
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2">
                Exp: {tarjeta.expMonth.toString().padStart(2, "0")}/
                {tarjeta.expYear}
              </Typography>

              <Button
                size="small"
                onClick={() => setChangingCard(true)}
                sx={{ color: "#fff", textTransform: "none" }}
              >
                Cambiar
              </Button>
            </Stack>
          </Box>
        )}

        {/* ➕ Nueva tarjeta */}
        {(!tarjeta || changingCard) && (
          <Box
            mb={3}
            px={2.5}
            py={2}
            borderRadius={3}
            sx={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              transition: "all 0.25s ease",
              "&:focus-within": {
                borderColor: "#007AFF",
                boxShadow: "0 0 0 3px rgba(0,122,255,0.15)",
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
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                    color: "#1C1C1E",
                    letterSpacing: "0.4px",

                    "::placeholder": {
                      color: "#8E8E93", // gris iOS
                      fontWeight: "400",
                    },

                    iconColor: "#007AFF", // azul iOS
                  },

                  invalid: {
                    color: "#FF3B30", // rojo iOS error
                    iconColor: "#FF3B30",
                  },

                  complete: {
                    color: "#34C759", // verde iOS success
                    iconColor: "#34C759",
                  },
                },
              }}
            />
          </Box>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
          }
          label="Establecer como tarjeta principal"
        />
      </Box>

      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || saving || !stripe}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
