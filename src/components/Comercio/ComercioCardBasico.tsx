import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  Box,
  Rating,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { ComercioDto } from "../../services/comercioApi";
import StarIcon from "@mui/icons-material/Star";

interface Props {
  comercio: ComercioDto;
}

export default function ComercioCardBasico({ comercio }: Props) {
  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 14px 32px rgba(0,0,0,0.16)",
        },
        width: "100%",
        maxWidth: { xs: "100%", sm: 320 },
        minHeight: 300,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          height: { xs: 95, sm: 110 },
          background: `linear-gradient(135deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          position: "relative",
          pb: 1.5,
        }}
      >
        <Avatar
          src={comercio.logoBase64}
          sx={{
            width: { xs: 72, sm: 84 },
            height: { xs: 72, sm: 84 },
            border: "3px solid #fff",
            backgroundColor: "#fff",
            boxShadow: "0 6px 16px rgba(0,0,0,0.22)",
            position: "absolute",
            bottom: { xs: -36, sm: -42 },
          }}
        />
      </Box>

      <CardContent sx={{ pt: { xs: 5, sm: 6 }, pb: 3 }}>
        <Stack spacing={1.4} alignItems="center">
          <Typography
            fontWeight={700}
            textAlign="center"
            sx={{
              color: comercio.colorPrimario,
              lineHeight: 1.3,
              letterSpacing: "0.2px",
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
            }}
          >
            {comercio.nombre}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.4}>
            <Rating
              value={comercio.promedioCalificacion ?? 0}
              precision={0.5}
              readOnly
              size="small"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
              sx={{ color: "#F5B301" }}
            />
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: "text.secondary",
                mt: "2px",
              }}
            >
              ({comercio.promedioCalificacion ?? 0})
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            textAlign="center"
            sx={{
              px: 1.5,
              maxWidth: 260,
              lineHeight: 1.45,
              fontSize: "0.75rem",
            }}
          >
            {`${comercio.direccion}, ${comercio.municipioNombre}, ${comercio.estadoNombre}.`}
          </Typography>

          <Chip
            label="Ver más detalles"
            icon={<ArrowForwardIosIcon fontSize="small" />}
            sx={{
              mt: 2,
              height: 36,
              px: 2.5,
              fontWeight: 600,
              fontSize: "0.74rem",
              borderRadius: 999,
              backgroundColor: comercio.colorPrimario,
              color: "#fff",
              boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
              transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.28)",
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
