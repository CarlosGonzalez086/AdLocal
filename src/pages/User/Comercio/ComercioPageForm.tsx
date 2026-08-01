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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { useComercio } from "../../../hooks/useComercio";

import ButtonBack from "../../../components/ButtonBack";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import { SelectEstadoAutocomplete } from "../../../components/Locations/SelectEstadoAutocomplete";
import { SelectMunicipioAutocomplete } from "../../../components/Locations/SelectMunicipioAutocomplete";
import { SelectTipoComercioAutocomplete } from "../../../components/TipoComercio/SelectTipoComercioAutocomplete";

import type {
  ComercioDto,
  HorarioComercioDto,
} from "../../../services/comercioApi";
import type { JwtClaims } from "../../../services/auth.api";

import { DIAS_SEMANA } from "../../../utils/constantes";

import styles from "../../../styles/MiComercioPage.module.css";

delete (
  L.Icon.Default.prototype as {
    _getIconUrl?: unknown;
  }
)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_LATITUDE = 19.4326;
const DEFAULT_LONGITUDE = -99.1332;

type EditableTextField =
  | "nombre"
  | "direccion"
  | "telefono"
  | "email"
  | "descripcion"
  | "colorPrimario"
  | "colorSecundario";

interface TabPanelProps {
  value: number;
  index: number;
  labelledBy: string;
  children: ReactNode;
}

interface SectionHeaderProps {
  icon: string;
  title: string;
  description?: string;
}

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (latitude: number, longitude: number) => void;
}

interface MapViewportProps {
  latitude: number;
  longitude: number;
}

const decodeClaims = (token: string | null): JwtClaims | null => {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode<JwtClaims>(token);
  } catch (error) {
    console.error("No fue posible decodificar el JWT:", error);

    return null;
  }
};

const getPositiveInteger = (value: unknown, fallback = 0): number => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return Math.floor(parsedValue);
};

const normalizarHorarios = (
  horarios: HorarioComercioDto[] = [],
): HorarioComercioDto[] => {
  return DIAS_SEMANA.map((day) => {
    const existingSchedule = horarios.find(
      (schedule) => schedule.dia === day.dia,
    );

    return (
      existingSchedule ?? {
        dia: day.dia,
        abierto: false,
        horaApertura: undefined,
        horaCierre: undefined,
      }
    );
  });
};

const createInitialForm = (id = 0): ComercioDto => ({
  id,
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
  colorPrimario: "#007AFF",
  colorSecundario: "#FF9500",
  horarios: normalizarHorarios(),
  estadoId: 0,
  municipioId: 0,
  estadoNombre: "",
  municipioNombre: "",
  promedioCalificacion: 0,
  tipoComercioId: 0,
  tipoComercio: "",
});

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("No fue posible procesar la imagen."));
    };

    reader.onerror = () => {
      reject(new Error("Ocurrió un error al leer la imagen."));
    };

    reader.readAsDataURL(file);
  });
};

const isImageFile = (file: File) => {
  return file.type.startsWith("image/");
};

const TabPanel = ({ value, index, labelledBy, children }: TabPanelProps) => {
  const isActive = value === index;

  return (
    <Box
      role="tabpanel"
      hidden={!isActive}
      id={`commerce-tabpanel-${index}`}
      aria-labelledby={labelledBy}
      className={styles.tabPanel}
    >
      {isActive && children}
    </Box>
  );
};

const SectionHeader = ({ icon, title, description }: SectionHeaderProps) => {
  return (
    <Box className={styles.sectionHeader}>
      <Box className={styles.sectionIcon}>
        <MaterialSymbol icon={icon} size="medium" />
      </Box>

      <Box className={styles.sectionHeaderText}>
        <Typography component="h2" className={styles.sectionTitle}>
          {title}
        </Typography>

        {description && (
          <Typography component="p" className={styles.sectionDescription}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const MapViewport = ({ latitude, longitude }: MapViewportProps) => {
  const map = useMap();

  useEffect(() => {
    const centerLatitude = latitude || DEFAULT_LATITUDE;

    const centerLongitude = longitude || DEFAULT_LONGITUDE;

    map.setView([centerLatitude, centerLongitude], 15);
  }, [latitude, longitude, map]);

  return null;
};

const LocationPicker = ({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) => {
  useMapEvents({
    click(event) {
      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });

  const hasPosition =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude !== 0 &&
    longitude !== 0;

  return hasPosition ? <Marker position={[latitude, longitude]} /> : null;
};

export function ComercioPageForm() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const { comercioPage, guardarPage, cargarPorId, loading, totalByUser } =
    useComercio();

  const claims = useMemo(() => decodeClaims(localStorage.getItem("token")), []);

  const comercioId = useMemo(() => {
    if (!id) {
      return 0;
    }

    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return null;
    }

    return parsedId;
  }, [id]);

  const isEditMode = comercioId !== null && comercioId > 0;

  const maxFotos = useMemo(
    () => getPositiveInteger(claims?.maxFotos, 0),
    [claims?.maxFotos],
  );

  const maxNegocios = useMemo(
    () => getPositiveInteger(claims?.maxNegocios, 0),
    [claims?.maxNegocios],
  );

  const [form, setForm] = useState<ComercioDto>(() =>
    createInitialForm(comercioId ?? 0),
  );

  const [tab, setTab] = useState(0);

  const [preview, setPreview] = useState("");

  const [galeria, setGaleria] = useState<string[]>([]);

  const limitAlertShownRef = useRef(false);

  const canUploadMoreImages = maxFotos > 0 && galeria.length < maxFotos;

  const remainingImages = Math.max(maxFotos - galeria.length, 0);

  const canCustomizeColors = claims?.planTipo !== "FREE";

  const handleChange =
    (field: EditableTextField) => (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      if (field === "telefono") {
        value = value.replace(/\D/g, "").slice(0, 10);
      }

      setForm((previousForm) => ({
        ...previousForm,
        [field]: value,
      }));
    };

  const updateHorario = useCallback(
    (dia: number, changes: Partial<HorarioComercioDto>) => {
      setForm((previousForm) => ({
        ...previousForm,

        horarios: previousForm.horarios.map((schedule) =>
          schedule.dia === dia
            ? {
                ...schedule,
                ...changes,
              }
            : schedule,
        ),
      }));
    },
    [],
  );

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isImageFile(file)) {
      await Swal.fire({
        icon: "warning",
        title: "Archivo no válido",
        text: "Selecciona un archivo de imagen.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#007AFF",
      });

      return;
    }

    try {
      const imageBase64 = await fileToBase64(file);

      setPreview(imageBase64);

      setForm((previousForm) => ({
        ...previousForm,
        logoBase64: imageBase64,
      }));
    } catch (error) {
      console.error("Error al procesar el logo:", error);

      await Swal.fire({
        icon: "error",
        title: "No se pudo cargar el logo",
        text: "Intenta seleccionar otra imagen.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#FF3B30",
      });
    }
  };

  const handleGaleriaChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (selectedFiles.length === 0 || remainingImages <= 0) {
      return;
    }

    const validFiles = selectedFiles
      .filter(isImageFile)
      .slice(0, remainingImages);

    if (validFiles.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Archivos no válidos",
        text: "Selecciona uno o más archivos de imagen.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#007AFF",
      });

      return;
    }

    try {
      const imagesBase64 = await Promise.all(validFiles.map(fileToBase64));

      setGaleria((currentGallery) => [...currentGallery, ...imagesBase64]);
    } catch (error) {
      console.error("Error al cargar la galería:", error);

      await Swal.fire({
        icon: "error",
        title: "No se pudieron cargar las imágenes",
        text: "Revisa los archivos seleccionados e inténtalo nuevamente.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#FF3B30",
      });
    }
  };

  const handleReplaceImage = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isImageFile(file)) {
      await Swal.fire({
        icon: "warning",
        title: "Archivo no válido",
        text: "Selecciona un archivo de imagen.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#007AFF",
      });

      return;
    }

    try {
      const imageBase64 = await fileToBase64(file);

      setGaleria((currentGallery) => {
        const updatedGallery = [...currentGallery];

        updatedGallery[index] = imageBase64;

        return updatedGallery;
      });
    } catch (error) {
      console.error("Error al reemplazar la imagen:", error);

      await Swal.fire({
        icon: "error",
        title: "No se pudo reemplazar la imagen",
        text: "Intenta seleccionar otra imagen.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#FF3B30",
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setGaleria((currentGallery) =>
      currentGallery.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const handleLocationChange = useCallback(
    (latitude: number, longitude: number) => {
      setForm((previousForm) => ({
        ...previousForm,
        lat: latitude,
        lng: longitude,
      }));
    },
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    await guardarPage({
      ...form,
      imagenes: galeria,
    });
  };

  const handleCancel = () => {
    navigate("/app/comercio");
  };

  useEffect(() => {
    if (comercioId === null) {
      void Swal.fire({
        icon: "error",
        title: "Comercio no válido",
        text: "El identificador del comercio no es válido.",
        confirmButtonText: "Volver",
        confirmButtonColor: "#007AFF",
        allowOutsideClick: false,
      }).then(() => {
        navigate("/app/comercio", {
          replace: true,
        });
      });

      return;
    }

    if (isEditMode) {
      void cargarPorId(comercioId);
      return;
    }

    if (
      maxNegocios <= 0 ||
      totalByUser < maxNegocios ||
      limitAlertShownRef.current
    ) {
      return;
    }

    limitAlertShownRef.current = true;

    void Swal.fire({
      icon: "warning",
      title: "Límite alcanzado",
      text: "Ya alcanzaste el máximo de negocios permitidos por tu plan.",
      confirmButtonText: "Volver",
      confirmButtonColor: "#007AFF",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      navigate("/app/comercio", {
        replace: true,
      });
    });
  }, [comercioId, isEditMode, maxNegocios, totalByUser, cargarPorId, navigate]);

  useEffect(() => {
    if (!isEditMode || !comercioPage || comercioPage.id === 0) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      colorPrimario: comercioPage.colorPrimario || "#007AFF",
      colorSecundario: comercioPage.colorSecundario || "#FF9500",
      horarios: normalizarHorarios(comercioPage.horarios ?? []),
      estadoId: comercioPage.estadoId ?? 0,
      municipioId: comercioPage.municipioId ?? 0,
      estadoNombre: comercioPage.estadoNombre ?? "",
      municipioNombre: comercioPage.municipioNombre ?? "",
      promedioCalificacion: comercioPage.promedioCalificacion ?? 0,
      tipoComercioId: comercioPage.tipoComercioId ?? 0,
      tipoComercio: comercioPage.tipoComercio ?? "",
    });

    setGaleria(comercioPage.imagenes ?? []);

    setPreview(comercioPage.logoBase64 ?? "");
  }, [comercioPage, isEditMode]);

  const mapLatitude = Number(form.lat) || DEFAULT_LATITUDE;

  const mapLongitude = Number(form.lng) || DEFAULT_LONGITUDE;

  return (
    <Box component="main" className={styles.page}>
      <Box className={styles.backContainer}>
        <ButtonBack route="/app/comercio" />
      </Box>

      <Box className={styles.formContainer}>
        <Box className={styles.tabsScroller}>
          <Tabs
            value={tab}
            onChange={(_, newValue: number) => setTab(newValue)}
            variant="scrollable"
            scrollButtons={false}
            aria-label="Secciones del formulario del comercio"
            className={styles.tabs}
            slotProps={{
              indicator: {
                className: styles.hiddenIndicator,
              },
            }}
          >
            <Tab
              id="commerce-tab-general"
              aria-controls="commerce-tabpanel-0"
              icon={<MaterialSymbol icon="settings" size="small" />}
              iconPosition="start"
              label="General"
              className={styles.tab}
            />

            <Tab
              id="commerce-tab-gallery"
              aria-controls="commerce-tabpanel-1"
              icon={<MaterialSymbol icon="photo_library" size="small" />}
              iconPosition="start"
              label="Galería"
              className={styles.tab}
            />

            <Tab
              id="commerce-tab-schedules"
              aria-controls="commerce-tabpanel-2"
              icon={<MaterialSymbol icon="schedule" size="small" />}
              iconPosition="start"
              label="Horarios"
              className={styles.tab}
            />

            <Tab
              id="commerce-tab-location"
              aria-controls="commerce-tabpanel-3"
              icon={<MaterialSymbol icon="location_on" size="small" />}
              iconPosition="start"
              label="Ubicación"
              className={styles.tab}
            />
          </Tabs>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TabPanel value={tab} index={0} labelledBy="commerce-tab-general">
            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="storefront"
                title="Información general"
                description="Configura los datos principales que verán tus clientes."
              />

              <Box className={styles.logoSection}>
                <Avatar
                  src={preview || undefined}
                  alt={
                    preview
                      ? `Logotipo de ${form.nombre || "comercio"}`
                      : "Sin logotipo"
                  }
                  className={styles.logoPreview}
                >
                  {!preview && (
                    <MaterialSymbol icon="storefront" size="large" />
                  )}
                </Avatar>

                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  className={styles.uploadLogoButton}
                  startIcon={<MaterialSymbol icon="upload" size="small" />}
                >
                  {preview ? "Cambiar logo" : "Subir logo"}

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>

              <Stack className={styles.fieldsStack}>
                <TextField
                  label="Nombre"
                  value={form.nombre ?? ""}
                  onChange={handleChange("nombre")}
                  fullWidth
                  required
                  className={styles.field}
                />

                <TextField
                  label="Dirección"
                  value={form.direccion ?? ""}
                  onChange={handleChange("direccion")}
                  fullWidth
                  className={styles.field}
                />

                <TextField
                  label="Teléfono"
                  value={form.telefono ?? ""}
                  onChange={handleChange("telefono")}
                  fullWidth
                  className={styles.field}
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      maxLength: 10,
                    },
                  }}
                />

                <TextField
                  type="email"
                  label="Correo electrónico"
                  value={form.email ?? ""}
                  onChange={handleChange("email")}
                  fullWidth
                  className={styles.field}
                />

                <TextField
                  label="Descripción"
                  value={form.descripcion ?? ""}
                  onChange={handleChange("descripcion")}
                  fullWidth
                  multiline
                  rows={4}
                  className={styles.field}
                />
              </Stack>
            </Box>

            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="location_city"
                title="Clasificación y región"
                description="Selecciona el estado, municipio y giro comercial."
              />

              <Stack className={styles.fieldsStack}>
                <SelectEstadoAutocomplete
                  value={form.estadoId}
                  onChange={(estadoId) => {
                    setForm((previousForm) => ({
                      ...previousForm,
                      estadoId,
                      municipioId: 0,
                    }));
                  }}
                />

                <SelectMunicipioAutocomplete
                  estadoId={form.estadoId}
                  value={form.municipioId}
                  onChange={(municipioId) => {
                    setForm((previousForm) => ({
                      ...previousForm,
                      municipioId,
                    }));
                  }}
                />

                <SelectTipoComercioAutocomplete
                  value={form.tipoComercioId}
                  onChange={(tipoComercioId) => {
                    setForm((previousForm) => ({
                      ...previousForm,
                      tipoComercioId,
                    }));
                  }}
                />
              </Stack>
            </Box>

            {canCustomizeColors && (
              <Box className={styles.sectionCard}>
                <SectionHeader
                  icon="palette"
                  title="Colores de marca"
                  description="Personaliza la apariencia pública de tu comercio."
                />

                <Box className={styles.colorGrid}>
                  <TextField
                    type="color"
                    label="Color primario"
                    value={form.colorPrimario || "#007AFF"}
                    onChange={handleChange("colorPrimario")}
                    fullWidth
                    className={[styles.field, styles.colorField].join(" ")}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  <TextField
                    type="color"
                    label="Color secundario"
                    value={form.colorSecundario || "#FF9500"}
                    onChange={handleChange("colorSecundario")}
                    fullWidth
                    className={[styles.field, styles.colorField].join(" ")}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tab} index={1} labelledBy="commerce-tab-gallery">
            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="photo_library"
                title="Galería del comercio"
                description="Agrega imágenes de tus instalaciones, productos o servicios."
              />

              <Button
                variant="outlined"
                component="label"
                disabled={!canUploadMoreImages}
                fullWidth
                className={styles.uploadGalleryButton}
                startIcon={
                  <MaterialSymbol icon="add_photo_alternate" size="small" />
                }
              >
                Subir imágenes ({galeria.length}/{maxFotos})
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGaleriaChange}
                />
              </Button>

              {maxFotos <= 0 && (
                <Typography
                  component="p"
                  className={styles.galleryLimitMessage}
                >
                  Tu plan no tiene imágenes de galería disponibles.
                </Typography>
              )}

              {galeria.length === 0 ? (
                <Box className={styles.emptyGallery}>
                  <Box className={styles.emptyGalleryIcon}>
                    <MaterialSymbol icon="imagesmode" size="large" />
                  </Box>

                  <Typography
                    component="h3"
                    className={styles.emptyGalleryTitle}
                  >
                    Galería vacía
                  </Typography>

                  <Typography
                    component="p"
                    className={styles.emptyGalleryDescription}
                  >
                    Las imágenes que agregues aparecerán aquí.
                  </Typography>
                </Box>
              ) : (
                <Box className={styles.galleryGrid}>
                  {galeria.map((image, index) => (
                    <Box
                      key={`${image.slice(0, 30)}-${index}`}
                      className={styles.galleryItem}
                    >
                      <Avatar
                        src={image}
                        alt={`Imagen ${index + 1} de la galería`}
                        variant="rounded"
                        className={styles.galleryImage}
                      />

                      <Box className={styles.galleryActions}>
                        <Button
                          component="label"
                          size="small"
                          className={styles.replaceButton}
                          startIcon={
                            <MaterialSymbol icon="sync" size="small" />
                          }
                        >
                          Reemplazar
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              void handleReplaceImage(index, event)
                            }
                          />
                        </Button>

                        <Button
                          type="button"
                          size="small"
                          className={styles.removeButton}
                          onClick={() => handleRemoveImage(index)}
                          aria-label={`Eliminar imagen ${index + 1}`}
                        >
                          <MaterialSymbol icon="delete" size="small" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={2} labelledBy="commerce-tab-schedules">
            <Box className={styles.schedulePageHeader}>
              <SectionHeader
                icon="schedule"
                title="Horarios de atención"
                description="Indica qué días abre el comercio y sus horas de operación."
              />
            </Box>

            <Stack className={styles.scheduleList}>
              {DIAS_SEMANA.map((day) => {
                const schedule = form.horarios.find(
                  (item) => item.dia === day.dia,
                );

                if (!schedule) {
                  return null;
                }

                return (
                  <Box
                    key={day.dia}
                    className={[
                      styles.scheduleCard,
                      schedule.abierto
                        ? styles.scheduleCardOpen
                        : styles.scheduleCardClosed,
                    ].join(" ")}
                  >
                    <Box className={styles.scheduleHeader}>
                      <Box className={styles.scheduleDay}>
                        <Box className={styles.scheduleDayIcon}>
                          <MaterialSymbol
                            icon={
                              schedule.abierto
                                ? "event_available"
                                : "event_busy"
                            }
                            size="small"
                          />
                        </Box>

                        <Typography
                          component="h3"
                          className={styles.scheduleDayTitle}
                        >
                          {day.label}
                        </Typography>
                      </Box>

                      <FormControlLabel
                        className={styles.scheduleControl}
                        control={
                          <Switch
                            checked={schedule.abierto}
                            size="small"
                            className={styles.scheduleSwitch}
                            onChange={(event) => {
                              const abierto = event.target.checked;

                              updateHorario(day.dia, {
                                abierto,

                                ...(!abierto && {
                                  horaApertura: undefined,

                                  horaCierre: undefined,
                                }),
                              });
                            }}
                          />
                        }
                        label={
                          <Typography
                            component="span"
                            className={[
                              styles.scheduleStatus,
                              schedule.abierto
                                ? styles.openStatus
                                : styles.closedStatus,
                            ].join(" ")}
                          >
                            {schedule.abierto ? "Abierto" : "Cerrado"}
                          </Typography>
                        }
                      />
                    </Box>

                    {schedule.abierto && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box className={styles.timeGrid}>
                          <TimePicker
                            label="Apertura"
                            ampm={false}
                            value={
                              schedule.horaApertura
                                ? dayjs(`2000-01-01T${schedule.horaApertura}`)
                                : null
                            }
                            onChange={(value) => {
                              updateHorario(day.dia, {
                                horaApertura: value?.format("HH:mm"),
                              });
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                className: styles.field,
                              },
                            }}
                          />

                          <TimePicker
                            label="Cierre"
                            ampm={false}
                            value={
                              schedule.horaCierre
                                ? dayjs(`2000-01-01T${schedule.horaCierre}`)
                                : null
                            }
                            onChange={(value) => {
                              updateHorario(day.dia, {
                                horaCierre: value?.format("HH:mm"),
                              });
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                className: styles.field,
                              },
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

          <TabPanel value={tab} index={3} labelledBy="commerce-tab-location">
            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="map"
                title="Ubicación en el mapa"
                description="Selecciona el punto exacto donde se encuentra el comercio."
              />

              <Box className={styles.mapInstructions}>
                <MaterialSymbol icon="touch_app" size="small" />

                <Typography
                  component="p"
                  className={styles.mapInstructionsText}
                >
                  Presiona sobre el mapa para colocar o mover el marcador.
                </Typography>
              </Box>

              <Box className={styles.mapContainer}>
                <MapContainer
                  center={[mapLatitude, mapLongitude]}
                  zoom={15}
                  className={styles.map}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapViewport
                    latitude={mapLatitude}
                    longitude={mapLongitude}
                  />

                  <LocationPicker
                    latitude={Number(form.lat) || 0}
                    longitude={Number(form.lng) || 0}
                    onLocationChange={handleLocationChange}
                  />
                </MapContainer>
              </Box>

              {form.lat !== 0 && form.lng !== 0 && (
                <Box className={styles.coordinates}>
                  <MaterialSymbol icon="my_location" size="small" />

                  <Typography
                    component="span"
                    className={styles.coordinatesText}
                  >
                    {Number(form.lat).toFixed(6)}, {Number(form.lng).toFixed(6)}
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>

          <Box className={styles.formActions}>
            <Button
              type="button"
              variant="outlined"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className={styles.submitButton}
              startIcon={
                loading ? undefined : (
                  <MaterialSymbol
                    icon={isEditMode ? "save" : "add_business"}
                    size="small"
                  />
                )
              }
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={19}
                    thickness={4.5}
                    className={styles.submitProgress}
                  />

                  <span>Guardando...</span>
                </>
              ) : isEditMode ? (
                "Guardar cambios"
              ) : (
                "Registrar comercio"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
