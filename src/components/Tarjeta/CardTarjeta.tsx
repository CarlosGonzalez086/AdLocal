import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  useMediaQuery,
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

  const colors = {
    main: "#6F4E37",
    dark: "#e8692c",
    light: "#f5e9cf",
  };

  return (
    <Card
      sx={{
        width: isMobile ? "100%" :320,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%)`,
        color: "#fff",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardContent>
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
            {brand.toUpperCase()}
          </Typography>

          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <CreditCardIcon fontSize="large" sx={{ opacity: 0.85 }} />
            {isDefault && (
              <Chip
                label="Principal"
                size="small"
                sx={{
                  mt: 1,
                  fontWeight: "bold",
                  color: colors.main,
                  backgroundColor: colors.light,
                }}
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{ letterSpacing: 3, mt: 1, mb: 1, fontFamily: "monospace" }}
        >
          **** **** **** {last4}
        </Typography>

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body2" sx={{ color: colors.light }}>
            Exp: {expMonth.toString().padStart(2, "0")}/{expYear}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.light }}>
            {cardType.toLocaleUpperCase()}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3} gap={1}>
          {onSetDefault && !isDefault && (
            <Button
              size="small"
              variant="contained"
              sx={{
                backgroundColor: colors.light,
                color: colors.main,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: colors.main,
                  color: colors.light,
                },
              }}
              onClick={() => onSetDefault(id)}
            >
              Hacer Default
            </Button>
          )}

          {onEdit && (
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: colors.light,
                color: colors.light,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
              onClick={() => onEdit(tarjeta)}
            >
              Editar
            </Button>
          )}

          {onEliminar && (
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: colors.light,
                color: colors.light,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "rgba(232,105,44,0.2)" },
              }}
              onClick={() => onEliminar(id)}
            >
              Eliminar
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
