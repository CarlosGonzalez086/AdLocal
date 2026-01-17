import {
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useComercio } from "../../../hooks/useComercio";
import { ComercioForm } from "./ComercioForm";
import { DIAS_SEMANA_MAP } from "../../../utils/constantes";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Palette,
} from "@mui/icons-material";

export const MiComercioPage = () => {
  const { comercio, loading, guardar, eliminar } = useComercio();
  const [editando, setEditando] = useState(false);
  const imagenes = comercio?.imagenes ?? [];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: "linear-gradient(135deg, #f9fafb, #eef2f7)",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4.5}
          sx={{
            color: "#6F4E37",
          }}
        />

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "text.secondary",
            letterSpacing: "0.3px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          Cargando comercio...
        </Typography>

        <style>
          {`
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
        `}
        </style>
      </Box>
    );
  }

  if (!comercio) {
    return (
      <Card>
        <CardContent>
          <h3 className="mb-3">Registrar comercio</h3>

          <ComercioForm
            initialData={{
              id: 0,
              nombre: "",
              direccion: "",
              telefono: "",
              email: "",
              descripcion: "",
              activo: true,
              lat: 0,
              lng: 0,
              logoBase64: "",
              imagenes: [],
              colorPrimario: "#000000",
              colorSecundario: "#FFFFFF",
              horarios: [],
              estadoId: 0,
              municipioId: 0,
              estadoNombre: "",
              MunicipioNombre: "",
            }}
            loading={loading}
            onSave={guardar}
          />
        </CardContent>
      </Card>
    );
  }

  if (editando) {
    return (
      <Card>
        <CardContent sx={{ overflow: "visible" }}>
          <h3 className="mb-3">Editar comercio</h3>

          <ComercioForm
            initialData={comercio}
            loading={loading}
            onSave={async (data) => {
              await guardar(data);
              setEditando(false);
            }}
            setEditando={() => setEditando(false)}
            soloVer={true}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            src={comercio.logoBase64 || undefined}
            variant="rounded"
            sx={{
              width: 130,
              height: 130,
              mb: 1,
              boxShadow: 2,
            }}
          />

          <Typography variant="h5" fontWeight={600}>
            {comercio.nombre}
          </Typography>

          {comercio.descripcion && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={0.5}
            >
              {comercio.descripcion}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.2}>
          {comercio.direccion && (
            <Box display="flex" gap={1} alignItems="center">
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2">
                {comercio.direccion +
                  "," +
                  comercio.municipioNombre +
                  "," +
                  comercio.estadoNombre +
                  "."}
              </Typography>
            </Box>
          )}

          {comercio.telefono && (
            <Box display="flex" gap={1} alignItems="center">
              <Phone fontSize="small" color="action" />
              <Typography variant="body2">{comercio.telefono}</Typography>
            </Box>
          )}

          {comercio.email && (
            <Box display="flex" gap={1} alignItems="center">
              <Email fontSize="small" color="action" />
              <Typography variant="body2">{comercio.email}</Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 3 }} />
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Palette fontSize="small" />
          <Typography fontWeight={600}>Colores</Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Chip
            sx={{
              backgroundColor: comercio.colorPrimario,
              color: "#000",
              border: "1px solid #ccc",
              borderRadius: 2,
              px: 1.5,
              fontWeight: 500,
            }}
          />
          <Chip
            sx={{
              backgroundColor: comercio.colorSecundario,
              color: "#000",
              border: "1px solid #ccc",
              borderRadius: 2,
              px: 1.5,
              fontWeight: 500,
            }}
          />
        </Stack>

        {imagenes.length > 0 && (
          <>
            <Divider className="my-3" />
            <h5>Imágenes</h5>

            <Box className="d-flex flex-wrap gap-2">
              {imagenes.map((img, index) => (
                <Avatar
                  key={index}
                  src={img}
                  variant="rounded"
                  sx={{ width: 100, height: 100 }}
                />
              ))}
            </Box>
          </>
        )}

        {comercio.horarios?.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AccessTime fontSize="small" />
              <Typography fontWeight={600}>Horarios de atención</Typography>
            </Box>

            <Stack spacing={1}>
              {comercio.horarios
                .sort((a, b) => a.dia - b.dia)
                .map((h) => (
                  <Box
                    key={h.dia}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: h.abierto ? "#f5f7fa" : "#fafafa",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography fontWeight={500}>
                      {DIAS_SEMANA_MAP[h.dia]}
                    </Typography>

                    {h.abierto ? (
                      <Typography variant="body2">
                        {h.horaApertura} – {h.horaCierre}
                      </Typography>
                    ) : (
                      <Chip
                        label="Cerrado"
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    )}
                  </Box>
                ))}
            </Stack>
          </>
        )}
        {comercio.lat !== 0 && comercio.lng !== 0 && (
          <Box mt={3} sx={{ height: 300, borderRadius: 2, overflow: "hidden" }}>
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
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setEditando(true)}
          >
            Editar
          </Button>

          <Button variant="outlined" color="error" fullWidth onClick={eliminar}>
            Eliminar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
