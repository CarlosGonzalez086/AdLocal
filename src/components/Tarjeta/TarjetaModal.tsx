import {
  Dialog,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
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

const colors = {
  main: "#6F4E37",
  dark: "#e8692c",
  light: "#f5e9cf",
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

  const [isDefault, setIsDefault] = useState(tarjeta?.isDefault ?? false);
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

    await onSave({
      paymentMethodId: pmId,
      isDefault,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box p={3}>
        <Typography variant="h5" mb={2}>
          {tarjeta ? "Editar Tarjeta" : "Nueva Tarjeta"}
        </Typography>

        {tarjeta && !changingCard && (
          <Box
            mb={3}
            p={3}
            borderRadius={3}
            sx={{
              background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%)`,
              color: "#fff",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", letterSpacing: 1 }}
              >
                {tarjeta.brand.toUpperCase()}
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Typography
                  variant="body2"
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    px: 1.5,
                    py: 0.3,
                    borderRadius: 1,
                  }}
                >
                  {tarjeta.cardType}
                </Typography>
                {tarjeta.isDefault && (
                  <Box
                    sx={{
                      mt: 1,
                      backgroundColor: colors.light,
                      color: colors.main,
                      px: 1.5,
                      py: 0.3,
                      borderRadius: 1,
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                    }}
                  >
                    Principal
                  </Box>
                )}
              </Box>
            </Box>

            <Typography
              variant="h6"
              sx={{ letterSpacing: 3, fontFamily: "monospace", mb: 1 }}
            >
              **** **** **** {tarjeta.last4}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Exp: {tarjeta.expMonth.toString().padStart(2, "0")}/
              {tarjeta.expYear}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                borderColor: "#fff",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                textTransform: "none",
              }}
              onClick={() => setChangingCard(true)}
            >
              Cambiar tarjeta
            </Button>
          </Box>
        )}

        {(!tarjeta || changingCard) && (
          <Box
            mb={2}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
            bgcolor="#fff"
          >
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
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
          label="Establecer como principal"
        />
      </Box>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.main,
            "&:hover": { backgroundColor: colors.dark },
          }}
          onClick={handleSave}
          disabled={loading}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
