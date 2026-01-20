import {
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import type {
  ComercioDto,
  HorarioComercioDto,
} from "../../../services/comercioApi";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { DIAS_SEMANA } from "../../../utils/constantes";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { SelectEstadoAutocomplete } from "../../../components/Locations/SelectEstadoAutocomplete";
import { SelectMunicipioAutocomplete } from "../../../components/Locations/SelectMunicipioAutocomplete";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const normalizarHorarios = (horarios: HorarioComercioDto[] = []) =>
  DIAS_SEMANA.map((d) => {
    const existente = horarios.find((h) => h.dia === d.dia);
    return (
      existente ?? {
        dia: d.dia,
        abierto: false,
        horaApertura: undefined,
        horaCierre: undefined,
      }
    );
  });

const TabPanel = ({
  value,
  index,
  children,
}: {
  value: number;
  index: number;
  children: React.ReactNode;
}) => (value === index ? <Box sx={{ mt: 3 }}>{children}</Box> : null);

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
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<ComercioDto>({
    ...initialData,
    horarios: normalizarHorarios(initialData.horarios),
  });
  const [preview, setPreview] = useState<string | null>(
    initialData.logoBase64 ?? null,
  );
  const [galeria, setGaleria] = useState<string[]>(initialData.imagenes ?? []);

  const handleChange =
    (field: keyof ComercioDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "telefono") {
        value = value.replace(/\D/g, "").slice(0, 10);
      }
      setForm({ ...form, [field]: value });
    };

  const updateHorario = (dia: number, changes: Partial<HorarioComercioDto>) =>
    setForm((prev) => ({
      ...prev,
      horarios: prev.horarios.map((h) =>
        h.dia === dia ? { ...h, ...changes } : h,
      ),
    }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setForm({ ...form, logoBase64: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const disponibles = 3 - galeria.length;
    files.slice(0, disponibles).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setGaleria((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleReplaceImage = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
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
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setForm({ ...form, lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return form.lat && form.lng ? (
      <Marker position={[form.lat, form.lng]} />
    ) : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, imagenes: galeria });
  };

  useEffect(() => {
    setForm({
      ...initialData,
      horarios: normalizarHorarios(initialData.horarios),
    });
    setPreview(initialData.logoBase64 ?? null);
    setGaleria(initialData.imagenes ?? []);
  }, [initialData]);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 0 },
        mt: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: "90%", md: "70%", lg: "50%" } }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            ".MuiTabs-indicator": {
              backgroundColor: "#007AFF",
              height: 3,
              borderRadius: 3,
            },
          }}
        >
          <Tab label="General" />
          <Tab label="Galería" />
          <Tab label="Horarios" />
          <Tab label="Ubicación" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <TabPanel value={tab} index={0}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                src={preview ?? undefined}
                sx={{
                  width: 120,
                  height: 120,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
              {soloVer && (
                <Button
                  component="label"
                  variant="outlined"
                  sx={{ mt: 2, textTransform: "none" }}
                >
                  Subir logo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              )}
            </Box>

            <Stack spacing={2}>
              <TextField
                label="Nombre"
                value={form.nombre}
                onChange={handleChange("nombre")}
                fullWidth
                disabled={!soloVer}
              />
              <TextField
                label="Dirección"
                value={form.direccion ?? ""}
                onChange={handleChange("direccion")}
                fullWidth
                disabled={!soloVer}
              />
              <TextField
                label="Teléfono"
                value={form.telefono ?? ""}
                onChange={handleChange("telefono")}
                fullWidth
                disabled={!soloVer}
              />
              <TextField
                label="Email"
                value={form.email ?? ""}
                onChange={handleChange("email")}
                fullWidth
                disabled={!soloVer}
              />
              <TextField
                label="Descripción"
                value={form.descripcion ?? ""}
                onChange={handleChange("descripcion")}
                fullWidth
                multiline
                rows={3}
                disabled={!soloVer}
              />
            </Stack>

            <SelectEstadoAutocomplete
              value={form.estadoId}
              onChange={(estadoId) =>
                setForm((prev) => ({ ...prev, estadoId, municipioId: 0 }))
              }
            />
            <SelectMunicipioAutocomplete
              estadoId={form.estadoId}
              value={form.municipioId}
              onChange={(id) =>
                setForm((prev) => ({ ...prev, municipioId: id }))
              }
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                type="color"
                label="Color primario"
                value={form.colorPrimario ?? "#007AFF"}
                onChange={handleChange("colorPrimario")}
                fullWidth
                disabled={!soloVer}
              />
              <TextField
                type="color"
                label="Color secundario"
                value={form.colorSecundario ?? "#FF9500"}
                onChange={handleChange("colorSecundario")}
                fullWidth
                disabled={!soloVer}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Button
              variant="outlined"
              component="label"
              disabled={!soloVer || galeria.length >= 3}
              fullWidth
              sx={{ mb: 2, textTransform: "none" }}
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

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {galeria.map((img, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={img}
                    variant="rounded"
                    sx={{
                      width: 100,
                      height: 100,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />
                  {soloVer && (
                    <Button
                      size="small"
                      component="label"
                      variant="outlined"
                      sx={{ fontSize: 10, mt: 1, textTransform: "none" }}
                    >
                      Reemplazar
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleReplaceImage(i, e)}
                      />
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Stack spacing={2}>
              {DIAS_SEMANA.map((d) => {
                const horario = form.horarios.find((h) => h.dia === d.dia)!;
                return (
                  <Box
                    key={d.dia}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#f9f9f9",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography fontWeight={600}>{d.label}</Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={horario.abierto}
                            disabled={!soloVer}
                            onChange={(e) =>
                              updateHorario(d.dia, {
                                abierto: e.target.checked,
                                ...(e.target.checked
                                  ? {}
                                  : {
                                      horaApertura: undefined,
                                      horaCierre: undefined,
                                    }),
                              })
                            }
                          />
                        }
                        label={horario.abierto ? "Abierto" : "Cerrado"}
                        sx={{
                          ".MuiFormControlLabel-label": {
                            fontWeight: 500,
                            color: horario.abierto
                              ? "success.main"
                              : "text.secondary",
                          },
                        }}
                      />
                    </Box>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 2,
                          justifyContent: "center",
                        }}
                      >
                        <TimePicker
                          label="Apertura"
                          ampm={false}
                          disabled={!soloVer || !horario.abierto}
                          value={
                            horario.horaApertura
                              ? dayjs(`2000-01-01T${horario.horaApertura}`)
                              : null
                          }
                          onChange={(v) =>
                            updateHorario(d.dia, {
                              horaApertura: v?.format("HH:mm"),
                            })
                          }
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                        />
                        <TimePicker
                          label="Cierre"
                          ampm={false}
                          disabled={!soloVer || !horario.abierto}
                          value={
                            horario.horaCierre
                              ? dayjs(`2000-01-01T${horario.horaCierre}`)
                              : null
                          }
                          onChange={(v) =>
                            updateHorario(d.dia, {
                              horaCierre: v?.format("HH:mm"),
                            })
                          }
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                        />
                      </Box>
                    </LocalizationProvider>

                    {!horario.abierto && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1, textAlign: "center" }}
                      >
                        Este día el comercio permanece cerrado
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <Box
              sx={{
                height: { xs: 250, sm: 300, md: 400 },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              <MapContainer
                center={[form.lat || 19.4326, form.lng || -99.1332]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker />
              </MapContainer>
            </Box>
          </TabPanel>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
              flexWrap: "wrap",
            }}
          >
            {soloVer && (
              <Button
                variant="outlined"
                onClick={setEditando}
                sx={{ textTransform: "none" }}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ textTransform: "none", py: 1.5, px: 3, borderRadius: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
