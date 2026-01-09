import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";

export interface PlanCardProps {
  nombre: string;
  tipo: string;
  dias: number;
  precio: number;
  moneda?: string;
  onSelect?: () => void;

  esActivo?: boolean;
  onCancelar?: () => void;
  onVerDetalle?: () => void;
}

export const PlanCard = ({
  nombre,
  tipo,
  dias,
  precio,
  moneda = "$",
  onSelect,
  esActivo = false,
  onCancelar,
  onVerDetalle,
}: PlanCardProps) => {
  const coffee = {
    activo: "#f5e9cf",
  };
  return (
    <Card
      className="shadow-sm h-100"
      sx={{
        borderRadius: 3,
        backgroundColor: esActivo ? coffee.activo : "primary.light",
      }}
    >
      <CardContent>
        <Box className="mb-2">
          <Chip
            label={esActivo ? "PLAN ACTIVO" : tipo}
            color={esActivo ? "success" : "primary"}
            size="small"
          />
        </Box>

        <Typography variant="h6" fontWeight="bold">
          {nombre}
        </Typography>

        <Typography variant="body2">
          Duración: <strong>{dias} días</strong>
        </Typography>

        <Typography variant="h4" fontWeight="bold">
          ${precio.toLocaleString()} {moneda}
        </Typography>
      </CardContent>

      <CardActions className="p-3">
        {esActivo ? (
          <>
            <Button fullWidth variant="outlined" onClick={onVerDetalle}>
              Ver detalles
            </Button>
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={onCancelar}
            >
              Cancelar plan
            </Button>
          </>
        ) : (
          <Button fullWidth variant="contained" onClick={onSelect}>
            Elegir plan
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
