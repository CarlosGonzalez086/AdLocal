import { Button, Switch, Tab, Tabs, TextField } from "@mui/material";
import {
  useEffect,
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
import Swal from "sweetalert2";

import { DIAS_SEMANA } from "../../../utils/constantes";
import { SelectEstadoAutocomplete } from "../../../components/Locations/SelectEstadoAutocomplete";
import { SelectMunicipioAutocomplete } from "../../../components/Locations/SelectMunicipioAutocomplete";
import { SelectTipoComercioAutocomplete } from "../../../components/TipoComercio/SelectTipoComercioAutocomplete";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import { HorarioTimePickers } from "../../../components/Comercio/HorarioTimePickers";

import type {
  ComercioDto,
  HorarioComercioDto,
} from "../../../types/User/comercio";

import type { JwtPayload } from "../../Auth/PrivateRouteUsuario";

/* ============================================
   LEAFLET
============================================ */

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

/* ============================================
   CONSTANTES
============================================ */

const DEFAULT_LATITUDE = 19.4326;
const DEFAULT_LONGITUDE = -99.1332;

/* ============================================
   TYPES
============================================ */

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

  user: JwtPayload | null;
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

/* ============================================
   HELPERS
============================================ */

const normalizarHorarios = (
  horarios: HorarioComercioDto[] = [],
): HorarioComercioDto[] =>
  DIAS_SEMANA.map((day) => {
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

const isImageFile = (file: File): boolean => file.type.startsWith("image/");

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
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

/* ============================================
   TAB PANEL
============================================ */

const TabPanel = ({ value, index, labelledBy, children }: TabPanelProps) => {
  const isActive = value === index;

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`commerce-form-panel-${index}`}
      aria-labelledby={labelledBy}
      className="commerceTabPanel"
    >
      {isActive && children}
    </div>
  );
};

/* ============================================
   SECTION HEADER
============================================ */

const SectionHeader = ({ icon, title, description }: SectionHeaderProps) => {
  return (
    <div className="commerceSectionHeader d-flex align-items-start gap-3">
      <div className="commerceSectionIcon flex-shrink-0">
        <MaterialSymbol icon={icon} size="medium" />
      </div>

      <div className="flex-grow-1">
        <h2 className="commerceSectionTitle fz-h2 fw-bold mb-1">{title}</h2>

        {description && (
          <p className="commerceSectionDescription fz-h4 fw-regular mb-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

/* ============================================
   MAP VIEWPORT
============================================ */

const MapViewport = ({ latitude, longitude }: MapViewportProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 15);
  }, [latitude, longitude, map]);

  return null;
};

/* ============================================
   LOCATION PICKER
============================================ */

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

  if (!hasLocation) {
    return null;
  }

  return <Marker position={[latitude, longitude]} />;
};

/* ============================================
   COMPONENT
============================================ */

export const ComercioForm = ({
  initialData,
  loading = false,
  onSave,
  soloVer = false,
  setEditando,
  user,
}: Props) => {
  /*
   * Se conserva el comportamiento original:
   * soloVer=true habilita la edición.
   */
  const editable = soloVer;

  /* ============================================
     STATE
  ============================================ */

  const [tab, setTab] = useState(0);

  const [form, setForm] = useState<ComercioDto>(() =>
    createFormState(initialData),
  );

  const [preview, setPreview] = useState<string | null>(
    initialData?.logoBase64 ?? null,
  );

  const [galeria, setGaleria] = useState<string[]>(initialData?.imagenes ?? []);

  /* ============================================
     PLAN
  ============================================ */
console.log(user);

  const maxFotos = getPositiveInteger(user?.maxFotos);

  const remainingImages = Math.max(maxFotos - galeria.length, 0);

  const canUploadImages = editable && remainingImages > 0;

  /* ============================================
     INPUTS
  ============================================ */

  const handleChange =
    (field: EditableTextField) => (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;

      const value =
        field === "telefono"
          ? rawValue.replace(/\D/g, "").slice(0, 10)
          : rawValue;

      setForm((previousForm) => ({
        ...previousForm,
        [field]: value,
      }));
    };

  /* ============================================
     HORARIOS
  ============================================ */

  const updateHorario = (dia: number, changes: Partial<HorarioComercioDto>) => {
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
  };

  /* ============================================
     ALERTAS
  ============================================ */

  const showInvalidImageAlert = async () => {
    await Swal.fire({
      icon: "warning",

      title: "Archivo no válido",

      text: "Selecciona un archivo de imagen.",

      confirmButtonText: "Entendido",

      confirmButtonColor: "#007AFF",
    });
  };

  const showImageErrorAlert = async (title: string, text: string) => {
    await Swal.fire({
      icon: "error",

      title,

      text,

      confirmButtonText: "Entendido",

      confirmButtonColor: "#FF3B30",
    });
  };

  /* ============================================
     LOGO
  ============================================ */

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || !editable) {
      return;
    }

    if (!isImageFile(file)) {
      await showInvalidImageAlert();

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

      await showImageErrorAlert(
        "No se pudo cargar el logo",
        "Intenta seleccionar otra imagen.",
      );
    }
  };

  /* ============================================
     GALERÍA
  ============================================ */

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

      await showImageErrorAlert(
        "No se pudieron cargar las imágenes",
        "Revisa los archivos seleccionados e inténtalo nuevamente.",
      );
    }
  };

  /* ============================================
     REEMPLAZAR IMAGEN
  ============================================ */

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
      await showInvalidImageAlert();

      return;
    }

    try {
      const imageBase64 = await fileToBase64(file);

      setGaleria((currentGallery) =>
        currentGallery.map((image, imageIndex) =>
          imageIndex === index ? imageBase64 : image,
        ),
      );
    } catch (error) {
      console.error("Error al reemplazar la imagen:", error);

      await showImageErrorAlert(
        "No se pudo reemplazar la imagen",
        "Intenta seleccionar otra imagen.",
      );
    }
  };

  /* ============================================
     ELIMINAR IMAGEN
  ============================================ */

  const handleRemoveImage = (index: number) => {
    if (!editable) {
      return;
    }

    setGaleria((currentGallery) =>
      currentGallery.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  /* ============================================
     LOCATION
  ============================================ */

  const handleLocationChange = (latitude: number, longitude: number) => {
    if (!editable) {
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,

      lat: latitude,
      lng: longitude,
    }));
  };

  /* ============================================
     SUBMIT
  ============================================ */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading || !editable) {
      return;
    }

    await onSave({
      ...form,

      imagenes: galeria,
    });
  };

  /* ============================================
     SINCRONIZAR INITIAL DATA
  ============================================ */

  useEffect(() => {
    const nextForm = createFormState(initialData);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(nextForm);

    setPreview(initialData?.logoBase64 ?? null);

    setGaleria(initialData?.imagenes ?? []);
  }, [initialData]);

  /* ============================================
     MAP
  ============================================ */

  const mapLatitude = Number(form.lat) || DEFAULT_LATITUDE;

  const mapLongitude = Number(form.lng) || DEFAULT_LONGITUDE;

  const hasSelectedLocation = Number(form.lat) !== 0 && Number(form.lng) !== 0;

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div className="commerceFormPage">
      <div className="commerceFormContainer">
        {/* ====================================
            TABS
        ==================================== */}

        <div className="commerceTabsScroller">
          <Tabs
            value={tab}
            onChange={(_, newValue: number) => {
              setTab(newValue);
            }}
            variant="scrollable"
            scrollButtons={false}
            aria-label="Secciones del formulario del comercio"
            className="commerceTabs"
            slotProps={{
              indicator: {
                className: "commerceHiddenIndicator",
              },
            }}
          >
            <Tab
              id="commerce-form-tab-general"
              aria-controls="commerce-form-panel-0"
              icon={<MaterialSymbol icon="settings" size="small" />}
              iconPosition="start"
              label="General"
              className="commerceTab fz-h4 fw-semibold"
            />

            <Tab
              id="commerce-form-tab-gallery"
              aria-controls="commerce-form-panel-1"
              icon={<MaterialSymbol icon="photo_library" size="small" />}
              iconPosition="start"
              label="Galería"
              className="commerceTab fz-h4 fw-semibold"
            />

            <Tab
              id="commerce-form-tab-schedules"
              aria-controls="commerce-form-panel-2"
              icon={<MaterialSymbol icon="schedule" size="small" />}
              iconPosition="start"
              label="Horarios"
              className="commerceTab fz-h4 fw-semibold"
            />

            <Tab
              id="commerce-form-tab-location"
              aria-controls="commerce-form-panel-3"
              icon={<MaterialSymbol icon="location_on" size="small" />}
              iconPosition="start"
              label="Ubicación"
              className="commerceTab fz-h4 fw-semibold"
            />
          </Tabs>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ====================================
              INFORMACIÓN GENERAL
          ==================================== */}

          <TabPanel
            value={tab}
            index={0}
            labelledBy="commerce-form-tab-general"
          >
            <section className="commerceSectionCard">
              <SectionHeader
                icon="storefront"
                title="Información general"
                description="Configura los datos principales que podrán consultar los usuarios."
              />

              {/* LOGO */}

              <div className="d-flex flex-column flex-sm-row align-items-center gap-3 mb-4">
                <div className="commerceLogoPreview">
                  {preview ? (
                    <img
                      src={preview}
                      alt={`Logotipo de ${form.nombre || "comercio"}`}
                      className="commerceLogoImage"
                    />
                  ) : (
                    <MaterialSymbol icon="storefront" size="large" />
                  )}
                </div>

                {editable && (
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    className="commerceUploadLogoButton fz-h4 fw-semibold"
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
              </div>

              {/* CAMPOS */}

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <TextField
                    label="Nombre"
                    value={form.nombre ?? ""}
                    onChange={handleChange("nombre")}
                    fullWidth
                    required
                    disabled={!editable}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <TextField
                    label="Dirección"
                    value={form.direccion ?? ""}
                    onChange={handleChange("direccion")}
                    fullWidth
                    disabled={!editable}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <TextField
                    label="Teléfono"
                    value={form.telefono ?? ""}
                    onChange={handleChange("telefono")}
                    fullWidth
                    disabled={!editable}
                    slotProps={{
                      htmlInput: {
                        inputMode: "numeric",

                        maxLength: 10,
                      },
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <TextField
                    type="email"
                    label="Correo electrónico"
                    value={form.email ?? ""}
                    onChange={handleChange("email")}
                    fullWidth
                    disabled={!editable}
                  />
                </div>

                <div className="col-12">
                  <TextField
                    label="Descripción"
                    value={form.descripcion ?? ""}
                    onChange={handleChange("descripcion")}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!editable}
                  />
                </div>
              </div>
            </section>

            {/* ====================================
                CLASIFICACIÓN
            ==================================== */}

            <section className="commerceSectionCard mt-4">
              <SectionHeader
                icon="location_city"
                title="Clasificación y región"
                description="Selecciona el estado, municipio y tipo de comercio."
              />

              <div
                className={!editable ? "commerceReadOnlySection" : undefined}
                aria-disabled={!editable}
              >
                <div className="row g-3">
                  <div className="col-12 col-md-6 col-lg-4">
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
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
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
                  </div>

                  <div className="col-12 col-lg-4">
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
                  </div>
                </div>
              </div>
            </section>

            {/* ====================================
                COLORES
            ==================================== */}

            <section className="commerceSectionCard mt-4">
              <SectionHeader
                icon="palette"
                title="Colores de marca"
                description="Personaliza la apariencia pública del comercio."
              />

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <TextField
                    type="color"
                    label="Color primario"
                    value={form.colorPrimario || "#007AFF"}
                    onChange={handleChange("colorPrimario")}
                    fullWidth
                    disabled={!editable}
                    className="commerceColorField"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <TextField
                    type="color"
                    label="Color secundario"
                    value={form.colorSecundario || "#FF9500"}
                    onChange={handleChange("colorSecundario")}
                    fullWidth
                    disabled={!editable}
                    className="commerceColorField"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </div>
              </div>
            </section>
          </TabPanel>

          {/* ====================================
              GALERÍA
          ==================================== */}

          <TabPanel
            value={tab}
            index={1}
            labelledBy="commerce-form-tab-gallery"
          >
            <section className="commerceSectionCard">
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
                  className="commerceUploadGalleryButton fz-h4 fw-semibold"
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

              {editable && maxFotos <= 0 && (
                <p className="commerceGalleryLimitMessage fz-h4 fw-medium mt-3 mb-0">
                  Tu plan no tiene imágenes de galería disponibles.
                </p>
              )}

              {galeria.length === 0 ? (
                <div className="commerceEmptyGallery">
                  <div className="commerceEmptyGalleryIcon">
                    <MaterialSymbol icon="imagesmode" size="large" />
                  </div>

                  <h3 className="commerceEmptyGalleryTitle fz-h3 fw-semibold">
                    Galería vacía
                  </h3>

                  <p className="commerceEmptyGalleryDescription fz-h4 fw-regular">
                    Las imágenes agregadas al comercio aparecerán aquí.
                  </p>
                </div>
              ) : (
                <div className="row g-3 mt-2">
                  {galeria.map((image, index) => (
                    <div
                      key={`${image.slice(0, 30)}-${index}`}
                      className="col-12 col-sm-6 col-lg-4"
                    >
                      <div className="commerceGalleryItem">
                        <img
                          src={image}
                          alt={`Imagen ${index + 1} de la galería`}
                          className="commerceGalleryImage"
                        />

                        {editable && (
                          <div className="d-flex align-items-center gap-2 p-3">
                            <Button
                              component="label"
                              size="small"
                              variant="outlined"
                              className="commerceReplaceButton fz-h5 fw-semibold"
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
                              className="commerceRemoveButton"
                              onClick={() => handleRemoveImage(index)}
                              aria-label={`Eliminar imagen ${index + 1}`}
                            >
                              <MaterialSymbol icon="delete" size="small" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </TabPanel>

          {/* ====================================
              HORARIOS
          ==================================== */}

          <TabPanel
            value={tab}
            index={2}
            labelledBy="commerce-form-tab-schedules"
          >
            <div className="mb-4">
              <SectionHeader
                icon="schedule"
                title="Horarios de atención"
                description="Indica los días y las horas de operación del comercio."
              />
            </div>

            <div className="row g-3">
              {DIAS_SEMANA.map((day) => {
                const schedule = form.horarios.find(
                  (item) => item.dia === day.dia,
                );

                if (!schedule) {
                  return null;
                }

                return (
                  <div key={day.dia} className="col-12 col-xl-6">
                    <div
                      className={`commerceScheduleCard ${
                        schedule.abierto
                          ? "commerceScheduleCardOpen"
                          : "commerceScheduleCardClosed"
                      }`}
                    >
                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                        <div className="d-flex align-items-center gap-2">
                          <div className="commerceScheduleDayIcon">
                            <MaterialSymbol
                              icon={
                                schedule.abierto
                                  ? "event_available"
                                  : "event_busy"
                              }
                              size="small"
                            />
                          </div>

                          <h3 className="commerceScheduleDayTitle fz-h4 fw-semibold mb-0">
                            {day.label}
                          </h3>
                        </div>

                        <label className="commerceScheduleControl d-flex align-items-center gap-2">
                          <Switch
                            checked={schedule.abierto}
                            disabled={!editable}
                            size="small"
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

                          <span
                            className={`commerceScheduleStatus fz-h5 fw-semibold ${
                              schedule.abierto
                                ? "commerceOpenStatus"
                                : "commerceClosedStatus"
                            }`}
                          >
                            {schedule.abierto ? "Abierto" : "Cerrado"}
                          </span>
                        </label>
                      </div>

                      {schedule.abierto && (
                        <HorarioTimePickers
                          horaApertura={schedule.horaApertura}
                          horaCierre={schedule.horaCierre}
                          disabled={!editable}
                          onChange={(horario) => {
                            if (editable) updateHorario(day.dia, horario);
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabPanel>

          {/* ====================================
              UBICACIÓN
          ==================================== */}

          <TabPanel
            value={tab}
            index={3}
            labelledBy="commerce-form-tab-location"
          >
            <section className="commerceSectionCard">
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
                <div className="commerceMapInstructions d-flex align-items-center gap-2">
                  <MaterialSymbol icon="touch_app" size="small" />

                  <p className="commerceMapInstructionsText fz-h4 fw-regular mb-0">
                    Presiona sobre el mapa para colocar o mover el marcador.
                  </p>
                </div>
              )}

              <div className="commerceMapContainer">
                <MapContainer
                  center={[mapLatitude, mapLongitude]}
                  zoom={15}
                  className="commerceMap"
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
              </div>

              {hasSelectedLocation && (
                <div className="commerceCoordinates d-flex align-items-center gap-2">
                  <MaterialSymbol icon="my_location" size="small" />

                  <span className="commerceCoordinatesText fz-h5 fw-medium">
                    {Number(form.lat).toFixed(6)}, {Number(form.lng).toFixed(6)}
                  </span>
                </div>
              )}
            </section>
          </TabPanel>

          {/* ====================================
              ACTIONS
          ==================================== */}

          {editable && (
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
              {setEditando && (
                <Button
                  type="button"
                  variant="outlined"
                  className="btn-adlocal--ghost fz-h4 fw-semibold"
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
                className="btn-adlocal--solid fz-h4 fw-semibold"
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
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />

                    <span className="ms-2 fz-h4 fw-semibold">Guardando...</span>
                  </>
                ) : form.id > 0 ? (
                  "Guardar cambios"
                ) : (
                  "Registrar comercio"
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
