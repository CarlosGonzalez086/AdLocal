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
}

export const PlanCard = ({
  nombre,
  tipo,
  dias,
  precio,
  moneda = "$",
  onSelect,
}: PlanCardProps) => {
  return (
    <Card
      className="shadow-sm h-100"
      sx={{
        borderRadius: 3,
        backgroundColor: "primary.light",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Box className="mb-2">
          <Chip
            label={tipo}
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              fontWeight: "bold",
            }}
            size="small"
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "primary.main" }}
          gutterBottom
        >
          {nombre}
        </Typography>

        <Typography variant="body2" sx={{ color: "#5c4a3d" }} className="mb-3">
          Duración: <strong>{dias} días</strong>
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "primary.dark" }}
        >
          {moneda}
          {precio.toLocaleString()}
        </Typography>

        <Typography variant="caption" sx={{ color: "#7a6655" }}>
          Precio total del plan
        </Typography>
      </CardContent>

      <CardActions className="p-3">
        <Button
          fullWidth
          size="large"
          onClick={onSelect}
          sx={{
            bgcolor: "primary.main",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Elegir plan
        </Button>
      </CardActions>
    </Card>
  );
};
