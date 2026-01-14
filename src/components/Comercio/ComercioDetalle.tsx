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
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

import type { ComercioDto } from "../../services/comercioApi";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";
import ProductoCard from "../ProductosServicios/ProductoCard";
import { diasSemana } from "../../utils/constantes";
import { estaAbiertoAhora } from "../../utils/generalsFunctions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";

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
  const hoy = new Date().getDay();
  const abiertoAhora = estaAbiertoAhora(comercio.horarios);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        borderRadius: 4,
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`,
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 5 },
          textAlign: "center",
        }}
      >
        <Avatar
          src={comercio.logoBase64}
          sx={{
            width: { xs: 80, sm: 120 },
            height: { xs: 80, sm: 120 },
            mx: "auto",
            mb: 1.5,
            border: "3px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />

        <Typography
          variant="h4"
          fontWeight="bold"
          color="#fff"
          sx={{ fontSize: { xs: "1.4rem", sm: "2rem" } }}
        >
          {comercio.nombre}
        </Typography>

        {comercio.descripcion && (
          <Typography color="#f5f5f5" mt={1}>
            {comercio.descripcion}
          </Typography>
        )}

        {/* ESTADO ACTUAL */}
        {comercio.horarios && (
          <Chip
            icon={<AccessTimeIcon />}
            label={abiertoAhora ? "Abierto ahora" : "Cerrado ahora"}
            sx={{
              mt: 2,
              px: 2,
              py: 1,
              fontWeight: "bold",
              borderRadius: 50,
              backgroundColor: abiertoAhora ? "#4caf50" : "#f44336",
              color: "#fff",
            }}
          />
        )}
      </Box>

      <Stack spacing={2} mt={3} px={4} pb={4}>
        {/* CONTACTO */}
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOnIcon sx={{ color: comercio.colorPrimario }} />
          <Typography>{comercio.direccion}</Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <WhatsAppIcon sx={{ color: "#25D366" }} />
          <Link
            href={`https://wa.me/${comercio.telefono}`}
            target="_blank"
            underline="none"
            sx={{ color: "inherit" }}
          >
            {comercio.telefono}
          </Link>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <EmailIcon sx={{ color: comercio.colorPrimario }} />
          <Link
            href={`mailto:${comercio.email}`}
            underline="none"
            sx={{ color: "inherit" }}
          >
            {comercio.email}
          </Link>
        </Stack>

        {comercio.imagenes && comercio.imagenes.length > 0 && (
          <>
            <Divider />
            <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
              Imágenes del negocio
            </Typography>
            <Box
              sx={{
                mt: 6,
                mx: 3,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <div
                id="carouselComercio"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-indicators">
                  {comercio.imagenes.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      data-bs-target="#carouselComercio"
                      data-bs-slide-to={idx}
                      className={idx === 0 ? "active" : ""}
                      aria-current={idx === 0 ? "true" : undefined}
                      aria-label={`Slide ${idx + 1}`}
                    ></button>
                  ))}
                </div>

                <div className="carousel-inner">
                  {comercio.imagenes.map((img, idx) => (
                    <div
                      key={idx}
                      className={`carousel-item ${idx === 0 ? "active" : ""}`}
                      style={{ height: 250 }}
                    >
                      <img
                        src={img}
                        className="d-block w-100"
                        alt={`Imagen ${idx + 1}`}
                        style={{ objectFit: "cover", height: "100%" }}
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
                  ></span>
                  <span className="visually-hidden">Previous</span>
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
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </Box>
          </>
        )}

        <Divider />
        <Accordion
          sx={{
            borderRadius: 3,
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon />
              <Typography fontWeight="bold">Horarios de atención</Typography>

              <Chip
                label={abiertoAhora ? "Abierto ahora" : "Cerrado ahora"}
                size="small"
                sx={{
                  ml: 1,
                  borderRadius: 50,
                  backgroundColor: abiertoAhora ? "#4caf50" : "#f44336",
                  color: "#fff",
                }}
              />
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={1}>
              {comercio.horarios?.map((h, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    backgroundColor:
                      h.dia === hoy ? "rgba(0,0,0,0.05)" : "#fafafa",
                  }}
                >
                  <Typography fontWeight={600}>{diasSemana[h.dia]}</Typography>

                  {h.abierto ? (
                    <Typography color="success.main" fontWeight={600}>
                      {dayjs(h.horaApertura, "HH:mm:ss").format("HH:mm")} –{" "}
                      {dayjs(h.horaCierre, "HH:mm:ss").format("HH:mm")}
                    </Typography>
                  ) : (
                    <Typography color="text.secondary" fontStyle="italic">
                      Cerrado
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Divider />
        <Accordion
          sx={{
            borderRadius: 3,
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Productos y servicios</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {loadingProducts ? (
              <Typography>Cargando...</Typography>
            ) : productos.length === 0 ? (
              <Typography>No hay productos o servicios.</Typography>
            ) : (
              <Stack spacing={2}>
                {productos.map((prod) => (
                  <ProductoCard key={prod.id} producto={prod} />
                ))}
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>

        {comercio.lat !== 0 && comercio.lng !== 0 && (
          <Box
            sx={{
              mt: 2,
              height: 250,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <MapContainer
              center={[comercio.lat, comercio.lng]}
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
              <Marker position={[comercio.lat, comercio.lng]} />
            </MapContainer>
          </Box>
        )}

        <Button
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontWeight: "bold",
            fontSize: 16,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`,
            color: "#fff",
          }}
          onClick={() =>
            window.open(
              `https://www.google.com/maps?q=${comercio.lat},${comercio.lng}`,
              "_blank"
            )
          }
        >
          Ver ubicación
        </Button>
      </Stack>
    </Box>
  );
}
