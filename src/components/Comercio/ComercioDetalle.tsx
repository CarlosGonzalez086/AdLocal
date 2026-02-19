import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
  Divider,
  Link,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { ComercioDto } from "../../services/comercioApi";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";
import ProductoCard from "../ProductosServicios/ProductoCard";
import { DIAS_SEMANA_MAP } from "../../utils/constantes";
import { estaAbiertoAhora } from "../../utils/generalsFunctions";
import CategoryIcon from "@mui/icons-material/Category";

interface Props {
  comercio: ComercioDto;
  productos: ProductoServicioDto[];
  loadingProducts: boolean;
}

/* ─── Badge ─── */
const BADGE_CONFIG: Record<
  string,
  {
    label: string;
    icon: string;
    background: string;
    color: string;
    shadow: string;
  }
> = {
  premium: {
    label: "Premium",
    icon: "👑",
    background: "linear-gradient(135deg, #FFD700, #FFB300)",
    color: "#1c1c1e",
    shadow: "0 8px 22px rgba(255,193,7,0.45)",
  },
  recomendado: {
    label: "Recomendado",
    icon: "⭐",
    background: "linear-gradient(135deg, #FF9800, #FB8C00)",
    color: "#fff",
    shadow: "0 8px 20px rgba(255,152,0,0.35)",
  },
  esencial: {
    label: "Esencial",
    icon: "✨",
    background: "rgba(255,255,255,0.82)",
    color: "#111",
    shadow: "0 6px 16px rgba(0,0,0,0.14)",
  },
};

const renderBadge = (badge?: string) => {
  if (!badge) return null;
  const key = badge.toLowerCase().includes("premium")
    ? "premium"
    : badge.toLowerCase().includes("recomendado")
      ? "recomendado"
      : "esencial";
  const cfg = BADGE_CONFIG[key];
  return (
    <Box
      sx={{
        position: "absolute",
        top: { xs: 8, sm: 12 },
        right: { xs: 8, sm: 12 },
        px: { xs: 1.2, sm: 1.5 },
        py: { xs: 0.35, sm: 0.45 },
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        fontSize: { xs: "0.6rem", sm: "0.68rem" },
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: cfg.background,
        color: cfg.color,
        boxShadow: cfg.shadow,
        border: "1px solid rgba(255,255,255,0.55)",
        transition: "all 0.25s ease",
        "&:hover": { transform: "scale(1.06)" },
        zIndex: 5,
      }}
    >
      {cfg.icon} {cfg.label}
    </Box>
  );
};

export default function ComercioDetalle({
  comercio,
  productos,
  loadingProducts,
}: Props) {
  const abiertoAhora = comercio?.horarios
    ? estaAbiertoAhora(comercio.horarios)
    : false;
  const colorPrimario = comercio?.colorPrimario ?? "#6f4e37";
  const colorSecundario = comercio?.colorSecundario ?? "#3e2723";
  const horarios = comercio?.horarios || [];
  const accordionSx = {
    borderRadius: "16px !important",
    mb: { xs: 2, sm: 2.5 },
    background: "rgba(255,255,255,0.90)",
    backdropFilter: "blur(18px) saturate(180%)",
    WebkitBackdropFilter: "blur(18px) saturate(180%)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    border: "1px solid rgba(0,0,0,0.06)",
    overflow: "hidden",
    "&:before": { display: "none" },
    transition: "all .3s cubic-bezier(.4,0,.2,1)",
    "&:hover": {
      boxShadow: "0 8px 28px rgba(0,0,0,0.11)",
      transform: "translateY(-1px)",
    },
  };

  const accordionSummarySx = {
    px: { xs: 2.5, sm: 3 },
    py: { xs: 1.5, sm: 1.8 },
    minHeight: 56,
    "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1 },
  };

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: { xs: "100%", sm: 600, md: 860 },
        width: "100%",
        mx: "auto",
        borderRadius: { xs: 3, sm: 4, md: 5 },
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      {renderBadge(comercio?.badge)}

      {/* ─── HERO ─── */}
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 5, sm: 6 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
          boxShadow: "0 12px 32px rgba(0,0,0,0.20)",
        }}
      >
        <Avatar
          src={comercio?.logoBase64}
          sx={{
            width: { xs: 96, sm: 110, md: 120 },
            height: { xs: 96, sm: 110, md: 120 },
            mb: 2,
            border: "3px solid rgba(255,255,255,0.9)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
            backgroundColor: "#fff",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.04)" },
          }}
        />

        <Typography
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.5px",
          }}
        >
          {comercio?.nombre}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ mt: 0.5 }}
        >
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 700,
            }}
          >
            {comercio?.calificacion ?? 0}
          </Typography>
          <Rating
            value={comercio?.calificacion ?? 0}
            precision={0.5}
            readOnly
            size="small"
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarIcon fontSize="inherit" />}
            sx={{ color: "#FFD54F" }}
          />
        </Stack>

        {comercio?.descripcion && (
          <Typography
            sx={{
              mt: 1.5,
              maxWidth: 520,
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {comercio.descripcion}
          </Typography>
        )}

        {comercio?.horarios && (
          <Chip
            icon={<AccessTimeIcon />}
            label={abiertoAhora ? "Abierto ahora" : "Cerrado ahora"}
            sx={{
              mt: 2.5,
              px: 1.5,
              height: 32,
              fontWeight: 700,
              fontSize: "0.78rem",
              color: "#fff",
              background: abiertoAhora
                ? "linear-gradient(135deg, #34C759, #30D158)"
                : "linear-gradient(135deg, #FF453A, #FF3B30)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
            }}
          />
        )}
      </Box>

      <Stack spacing={2} px={{ xs: 2.5, sm: 4 }} py={{ xs: 3, sm: 4 }}>
        <Box
          sx={{
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            border: "1px solid rgba(0,0,0,0.06)",
            px: { xs: 2.5, sm: 3 },
            py: 2.5,
          }}
        >
          <Stack spacing={1.8}>
            <Stack direction="row" spacing={1.2} alignItems="flex-start">
              <LocationOnIcon
                sx={{ fontSize: 20, mt: "2px", color: "text.disabled" }}
              />
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.5, fontWeight: 500 }}
              >
                {`${comercio?.direccion}, ${comercio?.municipioNombre}, ${comercio?.estadoNombre}.`}
              </Typography>
            </Stack>

            {comercio?.telefono && (
              <Stack direction="row" spacing={1.2} alignItems="center">
                <WhatsAppIcon sx={{ fontSize: 20, color: "#25D366" }} />
                <Link
                  href={`https://wa.me/${comercio.telefono}`}
                  target="_blank"
                  underline="none"
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "text.primary",
                    transition: "color 0.2s",
                    "&:hover": { color: "#25D366" },
                  }}
                >
                  {comercio.telefono}
                </Link>
              </Stack>
            )}

            {comercio?.email && (
              <Stack direction="row" spacing={1.2} alignItems="center">
                <EmailIcon sx={{ fontSize: 20, color: "text.disabled" }} />
                <Link
                  href={`mailto:${comercio.email}`}
                  underline="none"
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "text.primary",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {comercio.email}
                </Link>
              </Stack>
            )}

            {comercio?.tipoComercio && (
              <Stack direction="row" spacing={1.2} alignItems="center">
                <CategoryIcon sx={{ fontSize: 20, color: "text.disabled" }} />
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {comercio.tipoComercio}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>

        <Divider sx={{ opacity: 0.5 }} />

        {comercio?.imagenes && comercio.imagenes.length > 0 && (
          <>
            <Typography fontWeight={700} fontSize="1rem" sx={{ px: 0.5 }}>
              Imágenes del negocio
            </Typography>

            <Box
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                id="carouselComercio"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div
                  className="carousel-indicators"
                  style={{ marginBottom: 8 }}
                >
                  {comercio.imagenes.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      data-bs-target="#carouselComercio"
                      data-bs-slide-to={idx}
                      className={idx === 0 ? "active" : ""}
                      aria-current={idx === 0 ? "true" : undefined}
                      aria-label={`Slide ${idx + 1}`}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.8)",
                      }}
                    />
                  ))}
                </div>
                <div className="carousel-inner">
                  {comercio.imagenes.map((img, idx) => (
                    <div
                      key={idx}
                      className={`carousel-item ${idx === 0 ? "active" : ""}`}
                      style={{ height: 260 }}
                    >
                      <img
                        src={img}
                        alt={`Imagen ${idx + 1}`}
                        className="d-block w-100"
                        style={{ height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselComercio"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
                  />
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselComercio"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
                  />
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </div>
            </Box>

            <Divider sx={{ opacity: 0.5 }} />
          </>
        )}
        {horarios?.length > 0 && (
          <Accordion sx={accordionSx}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={accordionSummarySx}
            >
              <AccessTimeIcon sx={{ fontSize: 18, color: colorPrimario }} />
              <Typography
                fontWeight={700}
                fontSize={{ xs: "0.95rem", sm: "1rem" }}
              >
                Horarios de atención
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 } }}
            >
              <Stack spacing={1}>
                {horarios
                  .sort((a, b) => a.dia - b.dia)
                  .map((h) => (
                    <Box
                      key={h.dia}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: { xs: 0.5, sm: 1 },
                        px: 2,
                        py: 1.2,
                        borderRadius: 2,
                        backgroundColor: h.abierto
                          ? `${colorPrimario}12`
                          : "rgba(0,0,0,0.03)",
                      }}
                    >
                      <Typography fontWeight={600} fontSize="0.9rem">
                        {DIAS_SEMANA_MAP[h.dia]}
                      </Typography>
                      {h.abierto ? (
                        <Typography
                          sx={{
                            fontSize: "0.82rem",
                            color: "text.secondary",
                            fontWeight: 500,
                          }}
                        >
                          {h.horaAperturaFormateada} – {h.horaCierreFormateada}
                        </Typography>
                      ) : (
                        <Chip
                          label="Cerrado"
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                        />
                      )}
                    </Box>
                  ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}

        <Accordion sx={accordionSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={accordionSummarySx}
          >
            <CategoryIcon sx={{ fontSize: 18, color: colorPrimario }} />
            <Typography
              fontWeight={700}
              fontSize={{ xs: "0.95rem", sm: "1rem" }}
            >
              Productos / Servicios
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ px: { xs: 1.5, sm: 3 }, pb: { xs: 2.5, sm: 3 } }}
          >
            {loadingProducts ? (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  py: 3,
                }}
              >
                Cargando productos…
              </Typography>
            ) : productos.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography fontSize="1.5rem">📦</Typography>
                <Typography color="text.secondary" fontSize="0.875rem">
                  No hay productos disponibles.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2.2}>
                {productos.map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "transform .25s ease",
                      "&:hover": { transform: "scale(1.01)" },
                    }}
                  >
                    <ProductoCard producto={p} />
                  </Box>
                ))}
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>
        {comercio.lat !== 19.4326 && comercio.lng !== -99.1332 && (
          <Box
            sx={{
              mt: { xs: 2.5, sm: 3.5 },
              p: { xs: 1, sm: 1.5 },
              borderRadius: { xs: 3, sm: 4 },

              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",

              boxShadow: {
                xs: "0 8px 22px rgba(0,0,0,0.08)",
                sm: "0 14px 32px rgba(0,0,0,0.12)",
              },

              border: "1px solid rgba(255,255,255,0.6)",
              overflow: "hidden",

              height: { xs: 220, sm: 280 },
            }}
          >
            <MapContainer
              center={[Number(comercio.lat), Number(comercio.lng)]}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              zoomControl={false}
              touchZoom={false}
              keyboard={false}
              boxZoom={false}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[Number(comercio.lat), Number(comercio.lng)]} />
            </MapContainer>
          </Box>
        )}
        <Button
          fullWidth
          onClick={() =>
            window.open(
              `https://www.google.com/maps?q=${comercio?.lat},${comercio?.lng}`,
              "_blank",
            )
          }
          sx={{
            mt: 1,
            py: { xs: 1.4, sm: 1.6 },
            borderRadius: 999,
            fontWeight: 700,
            fontSize: { xs: "0.875rem", sm: "0.9rem" },
            textTransform: "none",
            background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
            color: "#fff",
            boxShadow: `0 8px 24px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.3)`,
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 14px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)`,
            },
            "&:active": { transform: "scale(0.98)" },
            mb: 1,
          }}
        >
          Ver ubicación en el mapa
        </Button>
      </Stack>
    </Box>
  );
}
