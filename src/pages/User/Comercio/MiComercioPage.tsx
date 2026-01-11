import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Divider,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useComercio } from "../../../hooks/useComercio";
import { ComercioForm } from "./ComercioForm";

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
    <Card>
      <CardContent>
        {comercio.logoBase64 && (
          <div className="d-flex justify-content-center mb-3">
            <Avatar
              src={comercio.logoBase64}
              sx={{ width: 120, height: 120 }}
              variant="rounded"
            />
          </div>
        )}

        <Divider className="mb-3" />

        <p>
          <b>Nombre:</b> {comercio.nombre}
        </p>
        <p>
          <b>Dirección:</b> {comercio.direccion}
        </p>
        <p>
          <b>Teléfono:</b> {comercio.telefono}
        </p>
        <p>
          <b>Email:</b> {comercio.email}
        </p>

        {comercio.descripcion && (
          <p>
            <b>Descripción:</b> {comercio.descripcion}
          </p>
        )}

        <Divider className="my-3" />
        <h5>Colores del comercio</h5>

        <Box className="d-flex gap-3 align-items-center">
          <Box>
            <small>Primario</small>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: comercio.colorPrimario,
                borderRadius: 1,
                border: "1px solid #ccc",
              }}
            />
            <small>{comercio.colorPrimario}</small>
          </Box>

          <Box>
            <small>Secundario</small>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: comercio.colorSecundario,
                borderRadius: 1,
                border: "1px solid #ccc",
              }}
            />
            <small>{comercio.colorSecundario}</small>
          </Box>
        </Box>

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

        {comercio.lat !== 0 && comercio.lng !== 0 && (
          <div className="my-3" style={{ height: 300 }}>
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
          </div>
        )}

        <div className="d-flex gap-2 mt-3">
          <Button variant="contained" onClick={() => setEditando(true)}>
            Editar
          </Button>

          <Button variant="outlined" color="error" onClick={eliminar}>
            Eliminar comercio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
