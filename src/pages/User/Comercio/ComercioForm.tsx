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
import type { JwtClaims } from "../../../services/auth.api";
import { SelectTipoComercioAutocomplete } from "../../../components/TipoComercio/SelectTipoComercioAutocomplete";

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
}) =>
  value === index ? (
    <Box
      sx={{
        width: "100%",
        mt: { xs: 1.5, sm: 2.5, md: 3 },
        px: { xs: 0, sm: 1, md: 2 },
        boxSizing: "border-box",
      }}
    >
      {children}
    </Box>
  ) : null;

interface Props {
  initialData: ComercioDto | null;
  loading?: boolean;
  onSave: (data: ComercioDto) => void;
  soloVer?: boolean;
  setEditando?: () => void;
  claims: JwtClaims | null;
}

export const ComercioForm = ({
  initialData,
  loading = false,
  onSave,
  soloVer = false,
  setEditando,
  claims,
}: Props) => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<ComercioDto>(() => ({
    ...(initialData ?? ({} as ComercioDto)),
    id: initialData?.id ?? 0,
    horarios: normalizarHorarios(initialData?.horarios),
  }));
  const [preview, setPreview] = useState<string | null>(
    initialData?.logoBase64 ?? null,
  );
  const [galeria, setGaleria] = useState<string[]>(initialData?.imagenes ?? []);

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
    const disponibles = Number(claims?.maxFotos) - galeria.length;
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

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: "#fff",
      "& fieldset": { borderColor: "#E0E0E0" },
      "&:hover fieldset": { borderColor: "#BDBDBD" },
      "&.Mui-focused fieldset": { borderColor: "#007AFF" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#007AFF" },
  };

  useEffect(() => {
    setForm({
      ...(initialData ?? ({} as ComercioDto)),
      id: initialData?.id ?? 0,
      horarios: normalizarHorarios(initialData?.horarios),
    });
    setPreview(initialData?.logoBase64 ?? null);
    setGaleria(initialData?.imagenes ?? []);
  }, [initialData]);

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1, sm: 2, md: 3 },
        mt: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: 900 } }}>
        {/* Tabs pill */}
        <Box
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            mb: { xs: 2.5, sm: 3 },
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons={false}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              minHeight: { xs: 40, sm: 46 },
              bgcolor: "#F2F2F7",
              borderRadius: 999,
              p: 0.7,
              width: "fit-content",
              mx: "auto",
              ".MuiTabs-flexContainer": { gap: 0.5 },
              ".MuiTab-root": {
                textTransform: "none",
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                fontWeight: 600,
                minHeight: { xs: 34, sm: 38 },
                px: { xs: 2, sm: 2.5 },
                borderRadius: 999,
                color: "text.secondary",
                transition: "all 0.22s ease",
                "&.Mui-selected": {
                  color: "#fff",
                  bgcolor: "#1c1c1e",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                },
              },
            }}
          >
            <Tab label="⚙️ General" />
            <Tab label="🖼️ Galería" />
            <Tab label="🕐 Horarios" />
            <Tab label="📍 Ubicación" />
          </Tabs>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* ================= GENERAL ================= */}
          <TabPanel value={tab} index={0}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(14px)",
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                p: { xs: 2.5, sm: 3 },
                mb: 2,
              }}
            >
              {/* Avatar */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={preview ?? undefined}
                    sx={{
                      width: { xs: 96, sm: 110 },
                      height: { xs: 96, sm: 110 },
                      border: "3px solid rgba(255,255,255,0.9)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
                    }}
                  />
                </Box>
                {soloVer && (
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1.5,
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      borderColor: "rgba(0,0,0,0.15)",
                      color: "text.secondary",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                    }}
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
                {[
                  { label: "Nombre", key: "nombre" },
                  { label: "Dirección", key: "direccion" },
                  { label: "Teléfono", key: "telefono" },
                  { label: "Email", key: "email" },
                ].map(({ label, key }) => (
                  <TextField
                    key={key}
                    label={label}
                    value={(form as any)[key] ?? ""}
                    onChange={handleChange(key)}
                    fullWidth
                    disabled={!soloVer}
                    sx={fieldSx}
                  />
                ))}

                <TextField
                  label="Descripción"
                  value={form.descripcion ?? ""}
                  onChange={handleChange("descripcion")}
                  fullWidth
                  multiline
                  rows={3}
                  disabled={!soloVer}
                  sx={fieldSx}
                />
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(14px)",
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                p: { xs: 2.5, sm: 3 },
                mb: 2,
              }}
            >
              <Typography
                fontWeight={700}
                fontSize="0.875rem"
                color="text.secondary"
                mb={2}
              >
                Ubicación
              </Typography>
              <Stack spacing={2}>
                <SelectEstadoAutocomplete
                  value={form.estadoId}
                  onChange={(estadoId) =>
                    setForm((p) => ({ ...p, estadoId, municipioId: 0 }))
                  }
                />
                <SelectMunicipioAutocomplete
                  estadoId={form.estadoId}
                  value={form.municipioId}
                  onChange={(id) => setForm((p) => ({ ...p, municipioId: id }))}
                />
                <SelectTipoComercioAutocomplete
                  value={form.tipoComercioId}
                  onChange={(id) =>
                    setForm((prev) => ({ ...prev, tipoComercioId: id }))
                  }
                />
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(14px)",
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                p: { xs: 2.5, sm: 3 },
              }}
            >
              <Typography
                fontWeight={700}
                fontSize="0.875rem"
                color="text.secondary"
                mb={2}
              >
                Colores de marca
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  type="color"
                  label="Color primario"
                  value={form.colorPrimario ?? "#007AFF"}
                  onChange={handleChange("colorPrimario")}
                  fullWidth
                  disabled={!soloVer}
                  sx={fieldSx}
                />
                <TextField
                  type="color"
                  label="Color secundario"
                  value={form.colorSecundario ?? "#FF9500"}
                  onChange={handleChange("colorSecundario")}
                  fullWidth
                  disabled={!soloVer}
                  sx={fieldSx}
                />
              </Box>
            </Box>
          </TabPanel>

          {/* ================= GALERÍA ================= */}
          <TabPanel value={tab} index={1}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(14px)",
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                p: { xs: 2.5, sm: 3 },
              }}
            >
              <Button
                variant="outlined"
                component="label"
                disabled={
                  !soloVer || galeria.length >= Number(claims?.maxFotos)
                }
                fullWidth
                sx={{
                  mb: 3,
                  py: 1.4,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "rgba(0,0,0,0.15)",
                  color: "text.secondary",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.03)" },
                }}
              >
                📷 Subir imágenes ({galeria.length}/{Number(claims?.maxFotos)})
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
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {galeria.map((img, i) => (
                  <Box key={i} textAlign="center">
                    <Avatar
                      src={img}
                      variant="rounded"
                      sx={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        height: "auto",
                        borderRadius: 3,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    />
                    {soloVer && (
                      <Button
                        size="small"
                        component="label"
                        variant="outlined"
                        sx={{
                          mt: 1,
                          fontSize: "0.7rem",
                          textTransform: "none",
                          borderRadius: 999,
                          borderColor: "rgba(0,0,0,0.12)",
                          color: "text.secondary",
                        }}
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
            </Box>
          </TabPanel>

          {/* ================= HORARIOS ================= */}
          <TabPanel value={tab} index={2}>
            <Stack spacing={1.5}>
              {DIAS_SEMANA.map((d) => {
                const horario = form.horarios.find((h) => h.dia === d.dia)!;
                return (
                  <Box
                    key={d.dia}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 4,
                      bgcolor: horario.abierto
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(0,0,0,0.03)",
                      border: "1px solid",
                      borderColor: horario.abierto
                        ? "rgba(0,0,0,0.07)"
                        : "rgba(0,0,0,0.04)",
                      boxShadow: horario.abierto
                        ? "0 2px 12px rgba(0,0,0,0.06)"
                        : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: horario.abierto ? 2 : 0,
                      }}
                    >
                      <Typography fontWeight={700} fontSize="0.9rem">
                        {d.label}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={horario.abierto}
                            disabled={!soloVer}
                            size="small"
                            onChange={(e) =>
                              updateHorario(d.dia, {
                                abierto: e.target.checked,
                                ...(!e.target.checked && {
                                  horaApertura: undefined,
                                  horaCierre: undefined,
                                }),
                              })
                            }
                          />
                        }
                        label={
                          <Typography
                            fontSize="0.8rem"
                            fontWeight={600}
                            color={
                              horario.abierto ? "success.main" : "text.disabled"
                            }
                          >
                            {horario.abierto ? "Abierto" : "Cerrado"}
                          </Typography>
                        }
                        sx={{ mr: 0 }}
                      />
                    </Box>

                    {horario.abierto && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2,
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
                              textField: { fullWidth: true, sx: fieldSx },
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
                              textField: { fullWidth: true, sx: fieldSx },
                            }}
                          />
                        </Box>
                      </LocalizationProvider>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </TabPanel>

          {/* ================= MAPA ================= */}
          <TabPanel value={tab} index={3}>
            <Box
              sx={{
                width: "100%",
                aspectRatio: "16 / 9",
                maxHeight: 420,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                border: "1px solid rgba(0,0,0,0.06)",
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

          {/* ================= BOTONES ================= */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: "flex-end",
              gap: 1.5,
              mt: 4,
            }}
          >
            {soloVer && (
              <Button
                variant="outlined"
                onClick={setEditando}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  borderColor: "rgba(0,0,0,0.15)",
                  color: "text.secondary",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                Cancelar
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                px: 4,
                py: 1.4,
                fontSize: "0.9rem",
                background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                "&:hover": {
                  boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "scale(0.98)" },
                transition: "all 0.25s ease",
              }}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  thickness={4}
                  sx={{ color: "#fff" }}
                />
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
