import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useComercio } from "../../../hooks/useComercio";
import { ComercioForm } from "./ComercioForm";

export const MiComercioPage = () => {
  const { comercio, loading, guardar, eliminar } = useComercio();
  const [editando, setEditando] = useState(false);
  console.log(comercio);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <p className="mb-2 text-muted">
            Cargando información del comercio...
          </p>
          <LinearProgress />
        </CardContent>
      </Card>
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
              activo: true,
              lat: 0,
              lng: 0,
              logoBase64: "",
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
            setEditando={() => {
              setEditando(false);
            }}
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
