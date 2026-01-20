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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDefault(tarjeta?.isDefault ?? false);
    setChangingCard(false);
  }, [tarjeta, open]);

  const createPaymentMethod = async (): Promise<string | null> => {
    if (!stripe || !elements) return null;

    const card = elements.getElement(CardElement);
    if (!card) return null;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      alert(error.message);
      return null;
    }

    return paymentMethod.id;
  };

  const handleSave = async () => {
    let pmId = tarjeta?.stripePaymentMethodId ?? null;

    if (!pmId || changingCard) {
      const newPmId = await createPaymentMethod();
      if (!newPmId) return;
      pmId = newPmId;
    }

    await onSave({ paymentMethodId: pmId, isDefault });
    onClose();
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
        {/* 🔹 Header */}
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
              background:
                "linear-gradient(135deg, #1C1C1E 0%, #3A3A3C 100%)",
              color: "#fff",
              boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography fontWeight={700} letterSpacing={1}>
                {tarjeta.brand.toUpperCase()}
              </Typography>

              {tarjeta.isDefault && (
                <Box
                  px={1.5}
                  py={0.5}
                  borderRadius={2}
                  fontSize="0.75rem"
                  bgcolor="#fff"
                  color="#000"
                  fontWeight={700}
                >
                  Principal
                </Box>
              )}
            </Stack>

            <Typography
              variant="h6"
              sx={{ letterSpacing: 3, fontFamily: "monospace" }}
            >
              •••• •••• •••• {tarjeta.last4}
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Exp: {tarjeta.expMonth.toString().padStart(2, "0")}/
                {tarjeta.expYear}
              </Typography>

              <Button
                size="small"
                onClick={() => setChangingCard(true)}
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.6)",
                  border: "1px solid",
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                  },
                }}
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
            p={2.5}
            borderRadius={3}
            sx={{
              backgroundColor: "#fff",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1C1C1E",
                    "::placeholder": {
                      color: "#8E8E93",
                    },
                  },
                  invalid: {
                    color: "#FF3B30",
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

      {/* 🔹 Actions */}
      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            px: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            background:
              "linear-gradient(135deg, #007AFF 0%, #005FCC 100%)",
            boxShadow: "0 8px 20px rgba(0,122,255,0.35)",
            "&:hover": {
              boxShadow: "0 10px 26px rgba(0,122,255,0.45)",
            },
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
