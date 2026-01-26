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
        height: 300,
        display: "flex",
        flexDirection: "column",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          height: 110,
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
            width: 84,
            height: 84,
            border: "3px solid #fff",
            backgroundColor: "#fff",
            boxShadow: "0 6px 16px rgba(0,0,0,0.22)",
            position: "absolute",
            bottom: -42,
          }}
        />
      </Box>

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

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Rating
              value={comercio.promedioCalificacion ?? 0}
              precision={0.5}
              readOnly
              size="small"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
              sx={{
                color: "#F5B301",
              }}
            />
            <Typography
              className="mt-1"
              sx={{ fontSize: "0.72rem", color: "text.secondary" }}
            >
              ({comercio.promedioCalificacion ?? 0})
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{
              px: 1,
              lineHeight: 1.4,
            }}
          >
            {comercio.direccion +
              "," +
              comercio.municipioNombre +
              "," +
              comercio.estadoNombre +
              "."}
          </Typography>

          <Chip
            label="Ver más detalles"
            icon={<ArrowForwardIosIcon fontSize="small" />}
            sx={{
              mt: 1.5,
              height: 34,
              px: 2,
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: 999,
              backgroundColor: comercio.colorPrimario,
              color: "#fff",
              boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "scale(1.06)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
