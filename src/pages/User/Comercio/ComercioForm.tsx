import { TextField, Button, CircularProgress, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import type { ComercioDto } from "../../../services/comercioApi";
import L from "leaflet";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  initialData: ComercioDto;
  loading?: boolean;
  onSave: (data: ComercioDto) => void;
  soloVer?: boolean;
  setEditando?: () => void;
}

export const ComercioForm = ({
  initialData,
  loading = false,
  onSave,
  soloVer = false,
  setEditando,
}: Props) => {
  const [form, setForm] = useState<ComercioDto>(initialData);
  const [preview, setPreview] = useState<string | null>(
    initialData.logoBase64 ?? null
  );

  const handleChange =
    (field: keyof ComercioDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (field === "telefono") {
        value = value.replace(/\D/g, "");
        if (value.length > 10) return;
      }

      setForm({ ...form, [field]: value });
    };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setForm({ ...form, logoBase64: base64 });
    };
    reader.readAsDataURL(file);
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setForm({
          ...form,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return form.lat && form.lng ? (
      <Marker position={[form.lat, form.lng]} />
    ) : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  useEffect(() => {
    setForm(initialData);
    setPreview(initialData.logoBase64 ?? null);
  }, [initialData]);

  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="d-flex flex-column align-items-center mb-4">
          <Avatar
            src={preview ?? undefined}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          {soloVer && (
            <Button variant="outlined" component="label">
              Subir logo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <TextField
                label="Nombre del comercio"
                value={form.nombre}
                onChange={handleChange("nombre")}
                fullWidth
                required
                disabled={!soloVer}
              />
            </div>

            <div className="col-12">
              <TextField
                label="Dirección"
                value={form.direccion ?? ""}
                onChange={handleChange("direccion")}
                fullWidth
                disabled={!soloVer}
              />
            </div>

            <div className="col-12 col-md-6">
              <TextField
                label="Teléfono"
                value={form.telefono ?? ""}
                onChange={handleChange("telefono")}
                fullWidth
                disabled={!soloVer}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </div>

            <div className="col-12">
              <div style={{ height: 300, borderRadius: 8, overflow: "hidden" }}>
                <MapContainer
                  center={[form.lat || 19.4326, form.lng || -99.1332]}
                  zoom={soloVer ? 20 : 14}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker />
                </MapContainer>
              </div>
            </div>

            {!soloVer && (
              <>
                <div className="row col-12 d-flex justify-content-end mt-3">
                  <div className="col-6">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? <CircularProgress size={24} /> : "Guardar"}
                    </Button>
                  </div>
                </div>
              </>
            )}
            {soloVer && (
              <>
                <div className="row col-12 d-flex justify-content-end mt-3">
                  <div className="col-6">
                    <Button variant="outlined" onClick={setEditando} fullWidth>
                      Cancelar
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? <CircularProgress size={24} /> : "Guardar"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
