import { Box, Typography, Stack } from "@mui/material";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";

interface Props {
  producto: ProductoServicioDto;
}

export default function ProductoCard({ producto }: Props) {
  return (
    <Box
      sx={{
        minWidth: 200,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      {producto.imagenBase64 && (
        <img
          src={producto.imagenBase64}
          alt={producto.nombre}
          style={{
            width: "100%",
            height: 120,
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      <Stack spacing={0.5} sx={{ p: 2 }}>
        <Typography fontWeight="bold">{producto.nombre}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {producto.descripcion}
        </Typography>
        <Typography fontWeight="bold" color="primary">
          ${producto.precio.toFixed(2)}
        </Typography>
      </Stack>
    </Box>
  );
}
