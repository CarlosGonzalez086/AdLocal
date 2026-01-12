import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { ComercioDto } from "../../services/comercioApi";

interface Props {
  comercio: ComercioDto;
}

export default function ComercioCard({ comercio }: Props) {
  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s ease",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 14px 32px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* HEADER CON GRADIENTE */}
      <Box
        sx={{
          height: 110,
          background: `linear-gradient(135deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          src={comercio.logoBase64}
          sx={{
            width: 82,
            height: 82,
            border: "3px solid #fff",
            backgroundColor: "#fff",
            boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
          }}
        />
      </Box>

      {/* CONTENIDO */}
      <CardContent sx={{ pt: 2.5 }}>
        <Stack spacing={1} alignItems="center">
          <Typography
            variant="h6"
            fontWeight={700}
            textAlign="center"
            sx={{
              color: comercio.colorPrimario,
              lineHeight: 1.2,
            }}
          >
            {comercio.nombre}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{
              px: 1,
              lineHeight: 1.4,
            }}
          >
            {comercio.direccion}
          </Typography>

          {/* CTA */}
          <Chip
            label="Ver más detalles"
            icon={<ArrowForwardIosIcon fontSize="small" />}
            sx={{
              mt: 1.5,
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: "0.8rem",
              borderRadius: 50,
              backgroundColor: comercio.colorSecundario,
              color: "#fff",
              boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              transition: "all 0.25s ease",
              "&:hover": {
                opacity: 0.9,
                transform: "scale(1.05)",
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
