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
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

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

import type {
  ComercioDto,
  HorarioComercioDto,
} from "../../../services/comercioApi";
import type { JwtClaims } from "../../../services/auth.api";

import { DIAS_SEMANA } from "../../../utils/constantes";

import { SelectEstadoAutocomplete } from "../../../components/Locations/SelectEstadoAutocomplete";
import { SelectMunicipioAutocomplete } from "../../../components/Locations/SelectMunicipioAutocomplete";
import { SelectTipoComercioAutocomplete } from "../../../components/TipoComercio/SelectTipoComercioAutocomplete";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import styles from "../../../styles/ComercioForm.module.css";

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

interface Props {
  initialData: ComercioDto | null;
  loading?: boolean;
  onSave:
    | ((data: ComercioDto) => void)
    | ((data: ComercioDto) => Promise<void>);
  soloVer?: boolean;
  setEditando?: () => void;
  claims: JwtClaims | null;
}

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
  editable: boolean;
  onLocationChange: (latitude: number, longitude: number) => void;
}

interface MapViewportProps {
  latitude: number;
  longitude: number;
}

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

const createFormState = (initialData: ComercioDto | null): ComercioDto => ({
  id: initialData?.id ?? 0,
  nombre: initialData?.nombre ?? "",
  direccion: initialData?.direccion ?? "",
  telefono: initialData?.telefono ?? "",
  email: initialData?.email ?? "",
  descripcion: initialData?.descripcion ?? "",
  activo: initialData?.activo ?? true,
  lat: initialData?.lat ?? 0,
  lng: initialData?.lng ?? 0,
  logoBase64: initialData?.logoBase64 ?? "",
  imagenes: initialData?.imagenes ?? [],
  colorPrimario: initialData?.colorPrimario || "#007AFF",
  colorSecundario: initialData?.colorSecundario || "#FF9500",
  horarios: normalizarHorarios(initialData?.horarios),
  estadoId: initialData?.estadoId ?? 0,
  municipioId: initialData?.municipioId ?? 0,
  estadoNombre: initialData?.estadoNombre ?? "",
  municipioNombre: initialData?.municipioNombre ?? "",
  promedioCalificacion: initialData?.promedioCalificacion ?? 0,
  tipoComercioId: initialData?.tipoComercioId ?? 0,
  tipoComercio: initialData?.tipoComercio ?? "",
});

const getPositiveInteger = (value: unknown): number => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return 0;
  }

  return Math.floor(parsedValue);
};

const isImageFile = (file: File) => {
  return file.type.startsWith("image/");
};

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

const TabPanel = ({ value, index, labelledBy, children }: TabPanelProps) => {
  const active = value === index;

  return (
    <Box
      role="tabpanel"
      hidden={!active}
      id={`commerce-form-panel-${index}`}
      aria-labelledby={labelledBy}
      className={styles.tabPanel}
    >
      {active && children}
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
    map.setView([latitude, longitude], 15);
  }, [latitude, longitude, map]);

  return null;
};

const LocationPicker = ({
  latitude,
  longitude,
  editable,
  onLocationChange,
}: LocationPickerProps) => {
  useMapEvents({
    click(event) {
      if (!editable) {
        return;
      }

      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });

  const hasLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude !== 0 &&
    longitude !== 0;

  return hasLocation ? <Marker position={[latitude, longitude]} /> : null;
};

export const ComercioForm = ({
  initialData,
  loading = false,
  onSave,
  soloVer = false,
  setEditando,
  claims,
}: Props) => {
  /*
   * Se conserva el nombre de la prop para no
   * afectar los componentes que ya la usan.
   * En el código original, soloVer=true permite
   * editar los campos.
   */
  const editable = soloVer;

  const [tab, setTab] = useState(0);

  const [form, setForm] = useState<ComercioDto>(() =>
    createFormState(initialData),
  );

  const [preview, setPreview] = useState<string | null>(
    initialData?.logoBase64 ?? null,
  );

  const [galeria, setGaleria] = useState<string[]>(initialData?.imagenes ?? []);

  const maxFotos = useMemo(
    () => getPositiveInteger(claims?.maxFotos),
    [claims?.maxFotos],
  );

  const remainingImages = Math.max(maxFotos - galeria.length, 0);

  const canUploadImages = editable && maxFotos > 0 && remainingImages > 0;

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

    if (!file || !editable) {
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
      console.error("Error al cargar el logo:", error);

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
    const files = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (!editable || files.length === 0 || remainingImages <= 0) {
      return;
    }

    const validFiles = files.filter(isImageFile).slice(0, remainingImages);

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

    if (!file || !editable) {
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
    if (!editable) {
      return;
    }

    setGaleria((currentGallery) =>
      currentGallery.filter((_, currentIndex) => currentIndex !== index),
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

    await onSave({
      ...form,
      imagenes: galeria,
    });
  };

  useEffect(() => {
    const nextForm = createFormState(initialData);

    setForm(nextForm);

    setPreview(initialData?.logoBase64 ?? null);

    setGaleria(initialData?.imagenes ?? []);
  }, [initialData]);

  const mapLatitude = Number(form.lat) || DEFAULT_LATITUDE;

  const mapLongitude = Number(form.lng) || DEFAULT_LONGITUDE;

  const hasSelectedLocation = Number(form.lat) !== 0 && Number(form.lng) !== 0;

  return (
    <Box className={styles.page}>
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
              id="commerce-form-tab-general"
              aria-controls="commerce-form-panel-0"
              icon={<MaterialSymbol icon="settings" size="small" />}
              iconPosition="start"
              label="General"
              className={styles.tab}
            />

            <Tab
              id="commerce-form-tab-gallery"
              aria-controls="commerce-form-panel-1"
              icon={<MaterialSymbol icon="photo_library" size="small" />}
              iconPosition="start"
              label="Galería"
              className={styles.tab}
            />

            <Tab
              id="commerce-form-tab-schedules"
              aria-controls="commerce-form-panel-2"
              icon={<MaterialSymbol icon="schedule" size="small" />}
              iconPosition="start"
              label="Horarios"
              className={styles.tab}
            />

            <Tab
              id="commerce-form-tab-location"
              aria-controls="commerce-form-panel-3"
              icon={<MaterialSymbol icon="location_on" size="small" />}
              iconPosition="start"
              label="Ubicación"
              className={styles.tab}
            />
          </Tabs>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TabPanel
            value={tab}
            index={0}
            labelledBy="commerce-form-tab-general"
          >
            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="storefront"
                title="Información general"
                description="Configura los datos principales que podrán consultar los usuarios."
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

                {editable && (
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
                )}
              </Box>

              <Stack className={styles.fieldsStack}>
                <TextField
                  label="Nombre"
                  value={form.nombre ?? ""}
                  onChange={handleChange("nombre")}
                  fullWidth
                  required
                  disabled={!editable}
                  className={styles.field}
                />

                <TextField
                  label="Dirección"
                  value={form.direccion ?? ""}
                  onChange={handleChange("direccion")}
                  fullWidth
                  disabled={!editable}
                  className={styles.field}
                />

                <TextField
                  label="Teléfono"
                  value={form.telefono ?? ""}
                  onChange={handleChange("telefono")}
                  fullWidth
                  disabled={!editable}
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
                  disabled={!editable}
                  className={styles.field}
                />

                <TextField
                  label="Descripción"
                  value={form.descripcion ?? ""}
                  onChange={handleChange("descripcion")}
                  fullWidth
                  multiline
                  rows={4}
                  disabled={!editable}
                  className={styles.field}
                />
              </Stack>
            </Box>

            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="location_city"
                title="Clasificación y región"
                description="Selecciona el estado, municipio y tipo de comercio."
              />

              <Box
                className={editable ? undefined : styles.readOnlySection}
                aria-disabled={!editable}
              >
                <Stack className={styles.fieldsStack}>
                  <SelectEstadoAutocomplete
                    value={form.estadoId}
                    onChange={(estadoId) => {
                      if (!editable) {
                        return;
                      }

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
                      if (!editable) {
                        return;
                      }

                      setForm((previousForm) => ({
                        ...previousForm,
                        municipioId,
                      }));
                    }}
                  />

                  <SelectTipoComercioAutocomplete
                    value={form.tipoComercioId}
                    onChange={(tipoComercioId) => {
                      if (!editable) {
                        return;
                      }

                      setForm((previousForm) => ({
                        ...previousForm,
                        tipoComercioId,
                      }));
                    }}
                  />
                </Stack>
              </Box>
            </Box>

            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="palette"
                title="Colores de marca"
                description="Personaliza la apariencia pública del comercio."
              />

              <Box className={styles.colorGrid}>
                <TextField
                  type="color"
                  label="Color primario"
                  value={form.colorPrimario || "#007AFF"}
                  onChange={handleChange("colorPrimario")}
                  fullWidth
                  disabled={!editable}
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
                  disabled={!editable}
                  className={[styles.field, styles.colorField].join(" ")}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Box>
            </Box>
          </TabPanel>

          <TabPanel
            value={tab}
            index={1}
            labelledBy="commerce-form-tab-gallery"
          >
            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="photo_library"
                title="Galería del comercio"
                description="Agrega imágenes de las instalaciones, productos o servicios."
              />

              {editable && (
                <Button
                  variant="outlined"
                  component="label"
                  disabled={!canUploadImages}
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
              )}

              {maxFotos <= 0 && editable && (
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
                    Las imágenes agregadas al comercio aparecerán aquí.
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

                      {editable && (
                        <Box className={styles.galleryActions}>
                          <Button
                            component="label"
                            size="small"
                            variant="outlined"
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
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel
            value={tab}
            index={2}
            labelledBy="commerce-form-tab-schedules"
          >
            <Box className={styles.schedulePageHeader}>
              <SectionHeader
                icon="schedule"
                title="Horarios de atención"
                description="Indica los días y las horas de operación del comercio."
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
                            disabled={!editable}
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
                            disabled={!editable}
                            value={
                              schedule.horaApertura
                                ? dayjs(`2000-01-01T${schedule.horaApertura}`)
                                : null
                            }
                            onChange={(value) => {
                              if (!editable) {
                                return;
                              }

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
                            disabled={!editable}
                            value={
                              schedule.horaCierre
                                ? dayjs(`2000-01-01T${schedule.horaCierre}`)
                                : null
                            }
                            onChange={(value) => {
                              if (!editable) {
                                return;
                              }

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

          <TabPanel
            value={tab}
            index={3}
            labelledBy="commerce-form-tab-location"
          >
            <Box className={styles.sectionCard}>
              <SectionHeader
                icon="map"
                title="Ubicación en el mapa"
                description={
                  editable
                    ? "Selecciona el punto exacto donde se encuentra el comercio."
                    : "Ubicación registrada para el comercio."
                }
              />

              {editable && (
                <Box className={styles.mapInstructions}>
                  <MaterialSymbol icon="touch_app" size="small" />

                  <Typography
                    component="p"
                    className={styles.mapInstructionsText}
                  >
                    Presiona sobre el mapa para colocar o mover el marcador.
                  </Typography>
                </Box>
              )}

              <Box className={styles.mapContainer}>
                <MapContainer
                  center={[mapLatitude, mapLongitude]}
                  zoom={15}
                  className={styles.map}
                  dragging={editable}
                  scrollWheelZoom={editable}
                  doubleClickZoom={editable}
                  touchZoom={editable}
                  keyboard={editable}
                  boxZoom={editable}
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
                    editable={editable}
                    onLocationChange={handleLocationChange}
                  />
                </MapContainer>
              </Box>

              {hasSelectedLocation && (
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
            {editable && setEditando && (
              <Button
                type="button"
                variant="outlined"
                className={styles.cancelButton}
                onClick={setEditando}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className={styles.submitButton}
              startIcon={
                loading ? undefined : (
                  <MaterialSymbol
                    icon={form.id > 0 ? "save" : "add_business"}
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
              ) : form.id > 0 ? (
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
};
