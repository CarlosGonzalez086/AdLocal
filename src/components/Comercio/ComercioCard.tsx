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
import type { ComercioDtoListItem } from "../../services/comercioApi";
import StarIcon from "@mui/icons-material/Star";
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

    const isPremium = badge.toLowerCase().includes("premium");

    return (
      <Box
        sx={{
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
          background: isPremium
            ? "linear-gradient(135deg, #FFD700, #FFB300)"
            : "rgba(255,255,255,0.82)",

          color: isPremium ? "#1c1c1e" : "#111",

          boxShadow: isPremium
            ? "0 6px 20px rgba(255, 215, 0, 0.45)"
            : "0 4px 14px rgba(0,0,0,0.18)",

          border: "1px solid rgba(255,255,255,0.65)",
          zIndex: 4,

          transition: "transform .25s ease, box-shadow .25s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <Box
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.8rem" },
            lineHeight: 1,
          }}
        >
          {isPremium ? "👑" : "⭐"}
        </Box>

        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: "inherit",
            fontWeight: "inherit",
          }}
        >
          {isPremium ? "Premium" : "Recomendado"}
        </Typography>
      </Box>
    );
  };

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
      {isProductOrServiceCreation ? <></> : <> {renderBadge(comercio.badge)}</>}

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
          src={comercio.logoUrl}
          alt={comercio.nombre}
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

          {isProductOrServiceCreation ? (
            <></>
          ) : (
            <>
              {" "}
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
            </>
          )}
          {isProductOrServiceCreation ? (
            <></>
          ) : (
            <>
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
            </>
          )}
          <Link
            to={
              isProductOrServiceCreation
                ? `comercio/${comercio.id}`
                : `app/vistaprevia/${comercio.id}`
            }
            style={{ textDecoration: "none" }}
            className="w-100 d-flex justify-content-center"
          >
            <Chip
              label={
                isProductOrServiceCreation
                  ? "Añadir productos o servicios"
                  : "Explorar comercio"
              }
              icon={<ArrowForwardIosIcon fontSize="inherit" />}
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
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
}
