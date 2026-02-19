import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Box,
  Rating,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";
import type { ComercioDtoListItem } from "../../services/comercioApi";
import { Link } from "react-router-dom";

interface Props {
  comercio: ComercioDtoListItem;
  isProductOrServiceCreation?: boolean;
}

export default function ComercioCard({
  comercio,
  isProductOrServiceCreation = false,
}: Props) {
  const renderBadge = (badge?: string) => {
    if (!badge) return null;

    const badgeLower = badge.toLowerCase();
    const isPremium = badgeLower.includes("premium");
    const isRecomendado = badgeLower.includes("recomendado");

    const stylesByBadge = isPremium
      ? {
          background: "linear-gradient(135deg, #FFD700, #FFB300)",
          color: "#1c1c1e",
          boxShadow: "0 6px 20px rgba(255,215,0,0.45)",
        }
      : isRecomendado
        ? {
            background: "linear-gradient(135deg, #FF9800, #FB8C00)",
            color: "#fff",
            boxShadow: "0 6px 18px rgba(255,152,0,0.4)",
          }
        : {
            background: "rgba(255,255,255,0.82)",
            color: "#111",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          };

    return (
      <Box
        sx={{
          ...stylesByBadge,
          position: "absolute",
          top: { xs: 8, sm: 12 },
          right: { xs: 8, sm: 12 },
          px: { xs: 1, sm: 1.4 },
          py: { xs: 0.35, sm: 0.55 },
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          gap: 0.6,
          fontSize: { xs: "0.6rem", sm: "0.68rem" },
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.65)",
          zIndex: 4,
          transition: "transform .25s ease",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" }, lineHeight: 1 }}>
            {isPremium ? "👑" : isRecomendado ? "⭐" : "✨"}
          </Box>
          <Typography
            sx={{ display: { xs: "none", sm: "block" }, fontSize: "inherit", fontWeight: 600 }}
          >
            {isPremium ? "Premium" : isRecomendado ? "Recomendado" : "Esencial"}
          </Typography>
        </Stack>
      </Box>
    );
  };

  const linkTo = isProductOrServiceCreation
    ? `comercio/${comercio.id}`
    : `vistaprevia/${comercio.id}`;

  const btnLabel = isProductOrServiceCreation
    ? "Añadir productos o servicios"
    : "Explorar comercio";

  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 5,
        overflow: "hidden",
        position: "relative",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
        },
        width: "100%",
        maxWidth: { xs: "100%", sm: 300 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        mx: "auto",
      }}
    >
      {!isProductOrServiceCreation && renderBadge(comercio.badge)}

      {/* IMAGEN / HEADER */}
      <Box sx={{ height: { xs: 160, sm: 180 }, position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background: comercio.logoUrl
              ? `url(${comercio.logoUrl}) center/cover no-repeat`
              : `linear-gradient(135deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`,
          }}
        />

        {/* Gradiente oscuro inferior */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Avatar */}
        <Avatar
          src={comercio.logoUrl}
          alt={comercio.nombre}
          sx={{
            width: { xs: 52, sm: 60 },
            height: { xs: 52, sm: 60 },
            border: "2.5px solid rgba(255,255,255,0.9)",
            backgroundColor: "#fff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            position: "absolute",
            bottom: 12,
            left: 14,
          }}
        />

        {/* Nombre sobre imagen */}
        <Typography
          fontWeight={700}
          sx={{
            position: "absolute",
            bottom: 16,
            left: { xs: 76, sm: 84 },
            color: "#fff",
            fontSize: { xs: "0.95rem", sm: "1rem" },
            textShadow: "0 1px 6px rgba(0,0,0,0.4)",
            lineHeight: 1.2,
            maxWidth: "calc(100% - 100px)",
          }}
        >
          {comercio.nombre}
        </Typography>
      </Box>

      {/* CONTENT */}
      <CardContent
        sx={{
          pt: 1.5,
          pb: "12px !important",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={1}>
          {!isProductOrServiceCreation && (
            <>
              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.5,
                  fontSize: "0.78rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {`${comercio.direccion}, ${comercio.municipioNombre}, ${comercio.estadoNombre}.`}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "text.primary" }}>
                  {comercio.promedioCalificacion ?? 0}
                </Typography>
                <Rating
                  value={comercio.promedioCalificacion ?? 0}
                  precision={0.5}
                  readOnly
                  size="small"
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                  sx={{ color: "#F5B301", fontSize: "0.85rem" }}
                />
              </Stack>
            </>
          )}
        </Stack>

        {/* Botón */}
        <Box mt={1.5}>
          <Link to={linkTo} style={{ textDecoration: "none" }}>
            <Box
              sx={{
                width: "100%",
                py: 1.1,
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.95)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                border: "1px solid rgba(0,0,0,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.8,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: comercio.colorPrimario,
                  "& .btn-text": { color: "#fff" },
                  "& .btn-icon": { color: "#fff" },
                  boxShadow: `0 6px 20px ${comercio.colorPrimario}55`,
                },
              }}
            >
              <Typography
                className="btn-text"
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "text.primary",
                  transition: "color 0.2s ease",
                }}
              >
                {btnLabel}
              </Typography>
              <ArrowForwardIosIcon
                className="btn-icon"
                sx={{
                  fontSize: 11,
                  color: "text.primary",
                  transition: "color 0.2s ease",
                }}
              />
            </Box>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}