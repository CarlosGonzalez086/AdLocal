import { Box, Typography, Stack } from "@mui/material";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";


interface Props {
  producto: ProductoServicioDto;
}

export default function ProductoCard({ producto }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        width: "100%",

        borderRadius: { xs: 3, sm: 4 },
        overflow: "hidden",

        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(14px) saturate(180%)",
        WebkitBackdropFilter: "blur(14px) saturate(180%)",

        boxShadow: {
          xs: "0 6px 18px rgba(0,0,0,0.08)",
          sm: "0 8px 26px rgba(0,0,0,0.1)",
        },

        border: "1px solid rgba(255,255,255,0.6)",
        cursor: "pointer",

        transition: "all .35s cubic-bezier(.4,0,.2,1)",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 14px 36px rgba(0,0,0,0.16)",
        },
      }}
    >
      {producto.imagenBase64 && (
        <Box
          component="img"
          src={producto.imagenBase64}
          alt={producto.nombre}
          sx={{
            width: { xs: "100%", sm: 120 },
            height: { xs: 160, sm: 120 },
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      )}

      <Stack
        spacing={0.8}
        sx={{
          p: { xs: 1.8, sm: 2.2 },
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "0.95rem", sm: "1rem" },
            lineHeight: 1.25,
            letterSpacing: "0.2px",
          }}
        >
          {producto.nombre}
        </Typography>

        {producto.descripcion && (
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              color: "text.secondary",
              lineHeight: 1.45,

              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: { xs: 3, sm: 2 },

              wordBreak: "break-word",
              hyphens: "auto",
            }}
          >
            {producto.descripcion}
          </Typography>
        )}

        {producto.precio != null && (
          <Typography
            sx={{
              mt: 0.4,
              fontWeight: 700,
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              color: "primary.main",
            }}
          >
            ${producto.precio.toFixed(2)}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
