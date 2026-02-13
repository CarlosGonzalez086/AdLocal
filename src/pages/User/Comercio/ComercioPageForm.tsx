import { useNavigate, useParams } from "react-router-dom";
import { useComercio } from "../../../hooks/useComercio";
import { useEffect, useState } from "react";
import type {
  ComercioDto,
  HorarioComercioDto,
} from "../../../services/comercioApi";
import type { JwtClaims } from "../../../services/auth.api";
import { jwtDecode } from "jwt-decode";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { DIAS_SEMANA } from "../../../utils/constantes";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { SelectEstadoAutocomplete } from "../../../components/Locations/SelectEstadoAutocomplete";
import { SelectMunicipioAutocomplete } from "../../../components/Locations/SelectMunicipioAutocomplete";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ButtonBack from "../../../components/ButtonBack";
import Swal from "sweetalert2";
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

export function ComercioPageForm() {
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;
  const { id } = useParams();
  const { comercioPage, guardarPage, cargarPorId, loading, totalByUser } =
    useComercio();

  const [form, setForm] = useState<ComercioDto>({
    id: id == undefined ? 0 : Number(id),
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    descripcion: "",
    activo: false,
    lat: 0,
    lng: 0,
    logoBase64: "",
    imagenes: [],
    colorPrimario: "",
    colorSecundario: "",
    horarios: normalizarHorarios(comercioPage?.horarios),
    estadoId: 0,
    municipioId: 0,
    estadoNombre: "",
    municipioNombre: "",
    promedioCalificacion: 0,
    tipoComercioId: 0,
    tipoComercio: "",
  });

  const [tab, setTab] = useState(0);
  const [preview, setPreview] = useState<string>("");
  const [galeria, setGaleria] = useState<string[]>([]);
  const navigate = useNavigate();

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
    guardarPage({ ...form, imagenes: galeria });
  };

  useEffect(() => {
    if (id) {
      cargarPorId(Number(id));
      return;
    }
    const max = Number(claims?.maxNegocios);
    const restantes = max - totalByUser;
    const limiteAlcanzado = restantes <= 0;

    if (limiteAlcanzado) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: "Ya alcanzaste el máximo de negocios permitidos para crear según tu plan.",
        confirmButtonText: "Volver",
        confirmButtonColor: "#0d6efd",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate("/app/comercio");
      });

      return;
    }
  }, [id]);

  useEffect(() => {
    if (!comercioPage) return;

    setForm({
      id: comercioPage.id ?? 0,
      nombre: comercioPage.nombre ?? "",
      direccion: comercioPage.direccion ?? "",
      telefono: comercioPage.telefono ?? "",
      email: comercioPage.email ?? "",
      descripcion: comercioPage.descripcion ?? "",
      activo: comercioPage.activo ?? false,
      lat: comercioPage.lat ?? 0,
      lng: comercioPage.lng ?? 0,
      logoBase64: comercioPage.logoBase64 ?? "",
      imagenes: comercioPage.imagenes ?? [],
      colorPrimario: comercioPage.colorPrimario ?? "",
      colorSecundario: comercioPage.colorSecundario ?? "",
      horarios: normalizarHorarios(comercioPage.horarios ?? []),
      estadoId: comercioPage.estadoId ?? 0,
      municipioId: comercioPage.municipioId ?? 0,
      estadoNombre: comercioPage.estadoNombre ?? "",
      municipioNombre: comercioPage.municipioNombre ?? "",
      promedioCalificacion: comercioPage.promedioCalificacion ?? 0,
      tipoComercioId: comercioPage.tipoComercioId ?? 0,
      tipoComercio: "",
    });
    setGaleria(comercioPage.imagenes);
    setPreview(comercioPage.logoBase64);
  }, [comercioPage]);

  console.log(galeria);
  

  return (
    <>
      <div className="pb-3">
        <ButtonBack route="/app/comercio" />
      </div>
      <Box
        sx={{
          width: "100%",
          px: { xs: 1, sm: 2, md: 3 },
          mt: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: 900 },
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons={false}
            allowScrollButtonsMobile
            sx={{
              mb: { xs: 2, sm: 3 },

              minHeight: { xs: 40, sm: 48 },

              ".MuiTabs-flexContainer": {
                gap: { xs: 1, sm: 2 },
              },

              ".MuiTab-root": {
                textTransform: "none",
                fontSize: { xs: 13, sm: 14, md: 15 },
                minHeight: { xs: 40, sm: 48 },
                px: { xs: 1.5, sm: 2 },
                borderRadius: 2,
              },

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
              </Box>

              <Stack spacing={2}>
                <TextField
                  label="Nombre"
                  value={form.nombre}
                  onChange={handleChange("nombre")}
                  fullWidth
                />
                <TextField
                  label="Dirección"
                  value={form.direccion ?? ""}
                  onChange={handleChange("direccion")}
                  fullWidth
                />
                <TextField
                  label="Teléfono"
                  value={form.telefono ?? ""}
                  onChange={handleChange("telefono")}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={form.email ?? ""}
                  onChange={handleChange("email")}
                  fullWidth
                />
                <TextField
                  label="Descripción"
                  value={form.descripcion ?? ""}
                  onChange={handleChange("descripcion")}
                  fullWidth
                  multiline
                  rows={3}
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
              <SelectTipoComercioAutocomplete
                value={form.tipoComercioId}
                onChange={(id) =>
                  setForm((prev) => ({ ...prev, tipoComercioId: id }))
                }
              />
              {claims?.planTipo != "FREE" ? (
                <>
                  {" "}
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
                    />
                    <TextField
                      type="color"
                      label="Color secundario"
                      value={form.colorSecundario ?? "#FF9500"}
                      onChange={handleChange("colorSecundario")}
                      fullWidth
                    />
                  </Box>
                </>
              ) : (
                <></>
              )}
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <Button
                variant="outlined"
                component="label"
                disabled={galeria.length >= Number(claims?.maxFotos)}
                fullWidth
                sx={{ mb: 2, textTransform: "none" }}
              >
                Subir imágenes ({galeria.length}/{Number(claims?.maxFotos)})
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
                              checked={horario?.abierto}
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
                          label={horario?.abierto ? "Abierto" : "Cerrado"}
                          sx={{
                            ".MuiFormControlLabel-label": {
                              fontWeight: 500,
                              color: horario?.abierto
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
                            disabled={!horario?.abierto}
                            value={
                              horario?.horaApertura
                                ? dayjs(`2000-01-01T${horario?.horaApertura}`)
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
                            disabled={!horario?.abierto}
                            value={
                              horario?.horaCierre
                                ? dayjs(`2000-01-01T${horario?.horaCierre}`)
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

                      {!horario?.abierto && (
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
                flexDirection: { xs: "column-reverse", sm: "row" },
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {}}
                sx={{ textTransform: "none" }}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  textTransform: "none",
                  py: 1.5,
                  px: 3,
                  borderRadius: 3,
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Guardar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}
