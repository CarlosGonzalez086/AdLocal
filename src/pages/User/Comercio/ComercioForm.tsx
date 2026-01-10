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
  const [galeria, setGaleria] = useState<string[]>(initialData.imagenes ?? []);

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

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const disponibles = 3 - galeria.length;
    const seleccionadas = files.slice(0, disponibles);

    seleccionadas.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGaleria((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleReplaceImage = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const copia = [...galeria];
      copia[index] = reader.result as string;
      setGaleria(copia);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
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
    onSave({
      ...form,
      imagenes: galeria,
    });
  };

  useEffect(() => {
    setForm(initialData);
    setPreview(initialData.logoBase64 ?? null);
    setGaleria(initialData.imagenes ?? []);
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

            <div className="col-12 col-md-6">
              <TextField
                label="Email"
                type="email"
                value={form.email ?? ""}
                onChange={handleChange("email")}
                fullWidth
                disabled={!soloVer}
              />
            </div>

            <div className="col-12">
              <TextField
                label="Descripción"
                value={form.descripcion ?? ""}
                onChange={handleChange("descripcion")}
                fullWidth
                multiline
                rows={3}
                disabled={!soloVer}
              />
            </div>

            {/* 🎨 Colores */}
            <div className="col-6">
              <TextField
                label="Color primario"
                type="color"
                value={form.colorPrimario ?? "#000000"}
                onChange={handleChange("colorPrimario")}
                fullWidth
                disabled={!soloVer}
              />
            </div>

            <div className="col-6">
              <TextField
                label="Color secundario"
                type="color"
                value={form.colorSecundario ?? "#ffffff"}
                onChange={handleChange("colorSecundario")}
                fullWidth
                disabled={!soloVer}
              />
            </div>

            {/* 🖼️ Galería */}
            <div className="col-12">
              <Button
                variant="outlined"
                component="label"
                disabled={!soloVer || galeria.length >= 3}
                fullWidth
              >
                Subir imágenes ({galeria.length}/3)
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGaleriaChange}
                />
              </Button>

              <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                {galeria.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      width: 110,
                      padding: 8,
                      borderRadius: 10,
                      border: "1px solid #e0e0e0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Avatar
                      src={img}
                      variant="rounded"
                      sx={{ width: 90, height: 90 }}
                    />

                    {soloVer && (
                      <div className="d-flex gap-1 w-100">
                        {/* 🔄 Reemplazar */}
                        <Button
                          size="small"
                          component="label"
                          variant="outlined"
                          sx={{ fontSize: 10, flex: 1 }}
                        >
                          Reemplazar
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleReplaceImage(i, e)}
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 📍 Mapa */}
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

            {/* Botones */}
            <div className="row col-12 d-flex justify-content-end mt-3">
              {soloVer && (
                <div className="col-6">
                  <Button variant="outlined" onClick={setEditando} fullWidth>
                    Cancelar
                  </Button>
                </div>
              )}
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
          </div>
        </form>
      </div>
    </div>
  );
};
