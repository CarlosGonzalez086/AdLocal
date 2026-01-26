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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { ComercioDto } from "../../services/comercioApi";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";
import ProductoCard from "../ProductosServicios/ProductoCard";
import { DIAS_SEMANA_MAP } from "../../utils/constantes";
import { estaAbiertoAhora } from "../../utils/generalsFunctions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";

interface Props {
  comercio: ComercioDto;
  productos: ProductoServicioDto[];
  loadingProducts: boolean;
}

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

  const renderBadge = (badge?: string) => {
    if (!badge) return null;

    const isPremium = badge.toLowerCase().includes("premium");

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

          background: isPremium
            ? "linear-gradient(135deg, #FFD700, #FFB300)"
            : "rgba(255,255,255,0.82)",

          color: isPremium ? "#1c1c1e" : "#111",

          boxShadow: isPremium
            ? `
            0 8px 22px rgba(255, 193, 7, 0.45),
            inset 0 1px 0 rgba(255,255,255,0.5)
          `
            : `
            0 6px 16px rgba(0,0,0,0.14),
            inset 0 1px 0 rgba(255,255,255,0.4)
          `,

          border: "1px solid rgba(255,255,255,0.55)",

          transition: "all 0.25s cubic-bezier(.4,0,.2,1)",

          "&:hover": {
            transform: "scale(1.06)",
          },

          zIndex: 5,
        }}
      >
        <Box
          component="span"
          sx={{
            display: { xs: "inline", sm: "inline-flex" },
            alignItems: "center",
            gap: 0.4,
          }}
        >
          {isPremium ? "👑 Premium" : "⭐ Recomendado"}
        </Box>
      </Box>
    );
  };

  console.log(comercio);

  return (
    <>
 
      <Box
        sx={{
          position: "relative",
          maxWidth: { xs: "100%", sm: 600, md: 900 },
          width: "100%",
          mx: "auto",
          borderRadius: { xs: 2, sm: 3, md: 4 },
          boxShadow: {
            xs: "0 4px 12px rgba(0,0,0,0.1)",
            sm: "0 6px 20px rgba(0,0,0,0.15)",
          },
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        {renderBadge(comercio?.badge)}

        <Box
          sx={{
            width: "100%",
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 4, sm: 5, md: 6 },
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",

            /* Apple-like gradient */
            background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,

            /* Suavizado iOS */
            boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
          }}
        >
          <Avatar
            src={comercio?.logoBase64}
            sx={{
              width: { xs: 96, sm: 110, md: 120 },
              height: { xs: 96, sm: 110, md: 120 },
              mb: 2,
              border: "3px solid rgba(255,255,255,0.9)",
              boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
              backgroundColor: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.04)",
              },
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.1rem" },
              fontWeight: 700,
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
            <Rating
              value={comercio?.promedioCalificacion ?? 0}
              precision={0.5}
              readOnly
              size="small"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
              sx={{ color: "#FFD54F" }}
            />
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.85)",
                mt: "2px",
              }}
            >
              ({comercio?.promedioCalificacion ?? 0})
            </Typography>
          </Stack>

          {comercio?.descripcion && (
            <Typography
              sx={{
                mt: 1.2,
                maxWidth: 520,
                fontSize: 14,
                lineHeight: 1.5,
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
                fontWeight: 600,
                color: "#fff",
                background: abiertoAhora
                  ? "linear-gradient(135deg, #34C759, #30D158)"
                  : "linear-gradient(135deg, #FF453A, #FF3B30)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              }}
            />
          )}
        </Box>

        <Stack spacing={2} px={4} py={4}>
          <Stack spacing={1.5} mt={2}>
            {/* Dirección */}
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="flex-start"
              sx={{
                color: "text.secondary",
              }}
            >
              <LocationOnIcon
                sx={{
                  fontSize: 20,
                  mt: "2px",
                  color: "text.disabled",
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.4,
                  fontWeight: 500,
                }}
              >
                {`${comercio?.direccion}, ${comercio?.municipioNombre}, ${comercio?.estadoNombre}.`}
              </Typography>
            </Stack>

            {/* WhatsApp */}
            {comercio?.telefono && (
              <Stack direction="row" spacing={1.2} alignItems="center">
                <WhatsAppIcon
                  sx={{
                    fontSize: 20,
                    color: "#25D366",
                  }}
                />

                <Link
                  href={`https://wa.me/${comercio.telefono}`}
                  target="_blank"
                  underline="none"
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "text.primary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#25D366",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {comercio.telefono}
                </Link>
              </Stack>
            )}

            {/* Email */}
            {comercio?.email && (
              <Stack direction="row" spacing={1.2} alignItems="center">
                <EmailIcon
                  sx={{
                    fontSize: 20,
                    color: "text.disabled",
                  }}
                />

                <Link
                  href={`mailto:${comercio.email}`}
                  underline="none"
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "text.primary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {comercio.email}
                </Link>
              </Stack>
            )}
          </Stack>

          <Divider />

          {comercio?.imagenes && comercio.imagenes.length > 0 && (
            <>
              <Typography
                variant="h6"
                fontWeight={700}
                mt={4}
                mb={2}
                sx={{
                  letterSpacing: "-0.3px",
                }}
              >
                Imágenes del negocio
              </Typography>

              <Box
                sx={{
                  mx: { xs: 0, sm: 1 },
                  mb: 3,
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  id="carouselComercio"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  {/* Indicadores estilo iOS */}
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

                  {/* Imágenes */}
                  <div className="carousel-inner">
                    {comercio.imagenes.map((img, idx) => (
                      <div
                        key={idx}
                        className={`carousel-item ${idx === 0 ? "active" : ""}`}
                        style={{
                          height: 260,
                        }}
                      >
                        <img
                          src={img}
                          alt={`Imagen ${idx + 1}`}
                          className="d-block w-100"
                          style={{
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Controles estilo Apple */}
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselComercio"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                      }}
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
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                      }}
                    />
                    <span className="visually-hidden">Siguiente</span>
                  </button>
                </div>
              </Box>

              <Divider sx={{ opacity: 0.6 }} />
            </>
          )}

          {horarios?.length > 0 && (
            <Accordion
              sx={{
                borderRadius: { xs: 2.5, sm: 3 },
                mb: { xs: 2, sm: 3 },
                overflow: "hidden",

                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(14px)",

                boxShadow: {
                  xs: "0 4px 14px rgba(0,0,0,0.06)",
                  sm: "0 8px 22px rgba(0,0,0,0.08)",
                },

                "&:before": { display: "none" },
                transition: "all 0.35s cubic-bezier(.4,0,.2,1)",

                "&:hover": {
                  boxShadow: "0 14px 28px rgba(0,0,0,0.12)",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 2 },
                  minHeight: 56,

                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                <Typography
                  fontWeight={700}
                  fontSize={{ xs: "1rem", sm: "1.1rem" }}
                >
                  Horarios de atención
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  px: { xs: 1.5, sm: 3 },
                  pb: { xs: 2, sm: 2.5 },
                }}
              >
                <Stack spacing={{ xs: 1.2, sm: 1 }}>
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

                          gap: { xs: 0.6, sm: 1 },
                          px: { xs: 2, sm: 2.5 },
                          py: { xs: 1.4, sm: 1.1 },

                          borderRadius: 2,
                          backgroundColor: h.abierto
                            ? "rgba(255, 149, 0, 0.08)"
                            : "rgba(0,0,0,0.03)",

                          transition: "all 0.25s ease",

                          "&:hover": {
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <Typography
                          fontWeight={600}
                          fontSize={{ xs: "0.95rem", sm: "0.9rem" }}
                        >
                          {DIAS_SEMANA_MAP[h.dia]}
                        </Typography>

                        {h.abierto ? (
                          <Typography
                            sx={{
                              fontSize: { xs: "0.85rem", sm: "0.82rem" },
                              color: "text.secondary",
                              fontWeight: 500,
                            }}
                          >
                            {h.horaAperturaFormateada} –{" "}
                            {h.horaCierreFormateada}
                          </Typography>
                        ) : (
                          <Chip
                            label="Cerrado"
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              alignSelf: { xs: "flex-start", sm: "center" },
                            }}
                          />
                        )}
                      </Box>
                    ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}

          <Accordion
            sx={{
              borderRadius: { xs: 3, sm: 4 },
              mb: { xs: 2.5, sm: 3 },

              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",

              boxShadow: {
                xs: "0 6px 20px rgba(0,0,0,0.08)",
                sm: "0 10px 30px rgba(0,0,0,0.1)",
              },

              border: "1px solid rgba(255,255,255,0.6)",
              overflow: "hidden",

              "&:before": { display: "none" },

              transition: "all .4s cubic-bezier(.4,0,.2,1)",

              "&:hover": {
                boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
                transform: "translateY(-1px)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1.7, sm: 2 },

                minHeight: 58,

                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 1.2,
                },

                "& .MuiSvgIcon-root": {
                  fontSize: "1.2rem",
                  color: "text.secondary",
                  transition: "transform .3s ease",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.05rem" },
                  letterSpacing: "0.2px",
                  lineHeight: 1.35,
                }}
              >
                Productos/Servicios
              </Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                px: { xs: 1.6, sm: 3 },
                pb: { xs: 2.6, sm: 3 },

                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.95))",
              }}
            >
              {loadingProducts ? (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    py: 2.5,
                  }}
                >
                  Cargando productos…
                </Typography>
              ) : productos.length === 0 ? (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    py: 2.5,
                  }}
                >
                  No hay productos disponibles.
                </Typography>
              ) : (
                <Stack spacing={{ xs: 2.2, sm: 2.6 }}>
                  {productos.map((p) => (
                    <Box
                      key={p.id}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",

                        wordBreak: "break-word",
                        hyphens: "auto",

                        transition: "transform .25s ease, box-shadow .25s ease",
                        "&:hover": {
                          transform: "scale(1.01)",
                        },
                      }}
                    >
                      <ProductoCard producto={p} />
                    </Box>
                  ))}
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>

          {comercio.lat && comercio.lng && (
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
                <Marker
                  position={[Number(comercio.lat), Number(comercio.lng)]}
                />
              </MapContainer>
            </Box>
          )}

          <Divider />

          <Divider />

          <Button
            fullWidth
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${comercio?.lat},${comercio?.lng}`,
                "_blank",
              )
            }
            sx={{
              mt: { xs: 2.5, sm: 3 },
              py: { xs: 1.3, sm: 1.5 },

              borderRadius: 999,
              fontWeight: 600,
              fontSize: { xs: "0.85rem", sm: "0.9rem" },
              letterSpacing: "0.02em",
              textTransform: "none",

              background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
              color: "#fff",

              boxShadow: `
      0 10px 28px rgba(0,0,0,0.14),
      inset 0 1px 0 rgba(255,255,255,0.35)
    `,

              transition: "all 0.28s cubic-bezier(.4,0,.2,1)",

              "&:hover": {
                transform: "translateY(-2px) scale(1.015)",
                boxShadow: `
        0 14px 36px rgba(0,0,0,0.18),
        inset 0 1px 0 rgba(255,255,255,0.45)
      `,
              },

              "&:active": {
                transform: "scale(0.98)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
              },
            }}
          >
            Ver ubicación en el mapa
          </Button>
        </Stack>
      </Box>
    </>
  );
}
