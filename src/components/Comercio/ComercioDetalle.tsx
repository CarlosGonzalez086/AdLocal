import { Box, Typography, Avatar, Stack, Button, Divider } from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

import type { ComercioDto } from "../../services/comercioApi";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";
import ProductoCard from "../ProductosServicios/ProductoCard";

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
  return (
    <Box
      sx={{
        borderRadius: 4,
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        overflow: "hidden",
        maxWidth: 800,
        mx: "auto",
        my: 4,
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`,
          p: 5,
          textAlign: "center",
          position: "relative",
        }}
      >
        <Avatar
          src={comercio.logoBase64}
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            border: "3px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
        <Typography variant="h4" fontWeight="bold" color="#fff">
          {comercio.nombre}
        </Typography>
        <Typography variant="subtitle1" color="#f5f5f5" sx={{ mt: 1 }}>
          {comercio.descripcion}
        </Typography>
      </Box>

      {comercio.imagenes && comercio.imagenes.length > 0 && (
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
      )}

      <Stack spacing={2} mt={3} px={4} pb={4}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOnIcon sx={{ color: comercio.colorPrimario }} />
          <Typography>{comercio.direccion}</Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <PhoneIcon sx={{ color: comercio.colorPrimario }} />
          <Typography>{comercio.telefono}</Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <EmailIcon sx={{ color: comercio.colorPrimario }} />
          <Typography>{comercio.email}</Typography>
        </Stack>

        <Divider />
        {!loadingProducts && (
          <>
            {" "}
            {/* LISTADO DE PRODUCTOS / SERVICIOS */}
            <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
              Productos y Servicios
            </Typography>
            {productos.length === 0 ? (
              <Typography>No hay productos o servicios disponibles.</Typography>
            ) : (
              <Stack spacing={2}>
                {productos.map((prod) => (
                  <ProductoCard key={prod.id} producto={prod} />
                ))}
              </Stack>
            )}
          </>
        )}

        <Divider />
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
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[comercio.lat, comercio.lng]} />
            </MapContainer>
          </Box>
        )}

        {/* BOTÓN DESTACADO */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontWeight: "bold",
            fontSize: 16,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`,
            color: "#fff",
            "&:hover": {
              opacity: 0.9,
            },
          }}
          onClick={() => {
            const url = `https://www.google.com/maps?q=${comercio.lat},${comercio.lng}`;
            window.open(url, "_blank"); 
          }}
        >
          Ver ubicación
        </Button>
      </Stack>
    </Box>
  );
}
