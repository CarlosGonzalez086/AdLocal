import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  useMediaQuery,
  Stack,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import type { TarjetaDto } from "../../services/tarjetaApi";
import theme from "../../theme/theme";

interface CardTarjetaProps {
  tarjeta: TarjetaDto;
  onSetDefault?: (id: number) => void;
  onEliminar?: (id: number) => void;
  onEdit?: (tarjeta: TarjetaDto) => void;
}

export const CardTarjeta: React.FC<CardTarjetaProps> = ({
  tarjeta,
  onSetDefault,
  onEliminar,
  onEdit,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { brand, last4, expMonth, expYear, cardType, isDefault, id } = tarjeta;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 360,
        borderRadius: 4,
        background: "linear-gradient(145deg, #1C1C1E 0%, #3A3A3C 100%)",
        color: "#fff",
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
        transition: "all .3s ease",
        ...(isMobile
          ? {}
          : {
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 28px 60px rgba(0,0,0,0.45)",
              },
            }),
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            fontWeight={700}
            letterSpacing={1.2}
            sx={{ textTransform: "uppercase" }}
          >
            {brand}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            {isDefault && (
              <Chip
                label="Principal"
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#fff",
                  color: "#000",
                  borderRadius: 2,
                }}
              />
            )}
            <CreditCardIcon sx={{ opacity: 0.85 }} />
          </Stack>
        </Box>

        <Typography
          variant="h6"
          sx={{
            letterSpacing: 4,
            fontFamily: "SF Mono, monospace",
            mb: 2.5,
          }}
        >
          •••• •••• •••• {last4}
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Exp: {expMonth.toString().padStart(2, "0")}/{expYear}
          </Typography>
          <Typography
            variant="body2"
            sx={{ opacity: 0.85, textTransform: "uppercase" }}
          >
            {cardType}
          </Typography>
        </Box>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={1}
          justifyContent="space-between"
        >
          {onSetDefault && !isDefault && (
            <Button
              size="small"
              onClick={() => onSetDefault(id)}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#fff",
                color: "#000",
                "&:hover": {
                  bgcolor: "#E5E5EA",
                },
              }}
              fullWidth={isMobile}
            >
              Hacer principal
            </Button>
          )}

          {onEdit && (
            <Button
              size="small"
              onClick={() => onEdit(tarjeta)}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.6)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
              fullWidth={isMobile}
            >
              Editar
            </Button>
          )}

          {onEliminar && (
            <Button
              size="small"
              onClick={() => onEliminar(id)}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                color: "#FF453A",
                border: "1px solid rgba(255,69,58,0.6)",
                "&:hover": {
                  backgroundColor: "rgba(255,69,58,0.15)",
                },
              }}
              fullWidth={isMobile}
            >
              Eliminar
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
