import { Button, Switch, Tab, Tabs, TextField } from "@mui/material";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import L from "leaflet";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import Swal from "sweetalert2";

import { useComercio } from "../../../hooks/useComercio";
import ButtonBack from "../../../components/ButtonBack";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import { HorarioTimePickers } from "../../../components/Comercio/HorarioTimePickers";

import { SelectEstadoAutocomplete } from "../../../components/Locations/SelectEstadoAutocomplete";
import { SelectMunicipioAutocomplete } from "../../../components/Locations/SelectMunicipioAutocomplete";
import { SelectTipoComercioAutocomplete } from "../../../components/TipoComercio/SelectTipoComercioAutocomplete";

import { DIAS_SEMANA } from "../../../utils/constantes";

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

interface ComercioPageFormProps {
  user: JwtPayload | null;
}

/* ============================================
   HELPERS
============================================ */

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

/* ============================================
   TAB PANEL
============================================ */

const TabPanel = ({ value, index, labelledBy, children }: TabPanelProps) => {
  const isActive = value === index;

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`commerce-tabpanel-${index}`}
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
    const centerLatitude = latitude || DEFAULT_LATITUDE;

    const centerLongitude = longitude || DEFAULT_LONGITUDE;

    map.setView([centerLatitude, centerLongitude], 15);
  }, [latitude, longitude, map]);

  return null;
};

/* ============================================
   LOCATION PICKER
============================================ */

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

/* ============================================
   COMPONENT
============================================ */

export function ComercioPageForm({ user }: ComercioPageFormProps) {
  const COMMERCE_ROUTE = "/usuario/app/comercio";

  const comercioToForm = (comercio: ComercioDto): ComercioDto => ({
    id: comercio.id ?? 0,

    nombre: comercio.nombre ?? "",

    direccion: comercio.direccion ?? "",

    telefono: comercio.telefono ?? "",

    email: comercio.email ?? "",

    descripcion: comercio.descripcion ?? "",

    activo: comercio.activo ?? false,

    lat: comercio.lat ?? 0,

    lng: comercio.lng ?? 0,

    logoBase64: comercio.logoBase64 ?? "",

    imagenes: comercio.imagenes ?? [],

    colorPrimario: comercio.colorPrimario || "#007AFF",

    colorSecundario: comercio.colorSecundario || "#FF9500",

    horarios: normalizarHorarios(comercio.horarios ?? []),

    estadoId: comercio.estadoId ?? 0,

    municipioId: comercio.municipioId ?? 0,

    estadoNombre: comercio.estadoNombre ?? "",

    municipioNombre: comercio.municipioNombre ?? "",

    promedioCalificacion: comercio.promedioCalificacion ?? 0,

    tipoComercioId: comercio.tipoComercioId ?? 0,

    tipoComercio: comercio.tipoComercio ?? "",
  });

  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const { comercioPage, guardarPage, cargarPorId, loading, totalByUser } =
    useComercio();

  /* ============================================
     IDENTIFICADOR
  ============================================ */

  const parsedId = Number(id);

  const comercioId = !id
    ? 0
    : Number.isInteger(parsedId) && parsedId > 0
      ? parsedId
      : null;

  const isEditMode = comercioId !== null && comercioId > 0;

  /* ============================================
     PLAN
  ============================================ */

  const planTipo = user?.planTipo?.toUpperCase() ?? "";

  const maxFotos = getPositiveInteger(user?.maxFotos, 0);

  const maxNegocios = getPositiveInteger(user?.maxNegocios, 0);

  const canCustomizeColors = planTipo !== "FREE";

  /* ============================================
     STATE
  ============================================ */

  const [form, setForm] = useState<ComercioDto>(() =>
    createInitialForm(comercioId ?? 0),
  );

  const [tab, setTab] = useState(0);

  const [preview, setPreview] = useState("");

  const [galeria, setGaleria] = useState<string[]>([]);

  const limitAlertShownRef = useRef(false);

  /* ============================================
     GALERÍA
  ============================================ */

  const remainingImages = Math.max(maxFotos - galeria.length, 0);

  const canUploadMoreImages = remainingImages > 0;

  /* ============================================
     CAMPOS
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
     ALERTAS DE IMÁGENES
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
     PROCESAR IMAGEN
  ============================================ */

  const processImageFile = async (file: File): Promise<string | null> => {
    if (!isImageFile(file)) {
      await showInvalidImageAlert();

      return null;
    }

    try {
      return await fileToBase64(file);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);

      return null;
    }
  };

  /* ============================================
     LOGO
  ============================================ */

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
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
      console.error("Error al procesar el logo:", error);

      await showImageErrorAlert(
        "No se pudo cargar el logo",
        "Intenta seleccionar otra imagen.",
      );
    }
  };

  /* ============================================
     AGREGAR GALERÍA
  ============================================ */

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

    if (!file) {
      return;
    }

    const imageBase64 = await processImageFile(file);

    if (!imageBase64) {
      await showImageErrorAlert(
        "No se pudo reemplazar la imagen",
        "Intenta seleccionar otra imagen.",
      );

      return;
    }

    setGaleria((currentGallery) =>
      currentGallery.map((image, imageIndex) =>
        imageIndex === index ? imageBase64 : image,
      ),
    );
  };

  /* ============================================
     ELIMINAR IMAGEN
  ============================================ */

  const handleRemoveImage = (index: number) => {
    setGaleria((currentGallery) =>
      currentGallery.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  /* ============================================
     UBICACIÓN
  ============================================ */

  const handleLocationChange = (latitude: number, longitude: number) => {
    setForm((previousForm) => ({
      ...previousForm,

      lat: latitude,

      lng: longitude,
    }));
  };

  /* ============================================
     GUARDAR
  ============================================ */

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

  /* ============================================
     CANCELAR
  ============================================ */

  const handleCancel = () => {
    navigate(COMMERCE_ROUTE);
  };

  /* ============================================
     VALIDAR / CARGAR COMERCIO
  ============================================ */

  useEffect(() => {
    if (comercioId === null) {
      void Swal.fire({
        icon: "error",

        title: "Comercio no válido",

        text: "El identificador del comercio no es válido.",

        confirmButtonText: "Volver",

        confirmButtonColor: "#007AFF",

        allowOutsideClick: false,

        allowEscapeKey: false,
      }).then(() => {
        navigate(COMMERCE_ROUTE, {
          replace: true,
        });
      });

      return;
    }

    if (isEditMode) {
      void cargarPorId(comercioId);

      return;
    }

    const reachedBusinessLimit = maxNegocios > 0 && totalByUser >= maxNegocios;

    if (!reachedBusinessLimit || limitAlertShownRef.current) {
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
      navigate(COMMERCE_ROUTE, {
        replace: true,
      });
    });
  }, [comercioId, isEditMode, maxNegocios, totalByUser, cargarPorId, navigate]);

  /* ============================================
     CARGAR DATOS EN MODO EDICIÓN
  ============================================ */

  useEffect(() => {
    if (!isEditMode || !comercioPage || comercioPage.id === 0) {
      return;
    }

    const comercioForm = comercioToForm(comercioPage);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(comercioForm);

    setGaleria(comercioForm.imagenes ?? []);

    setPreview(comercioForm.logoBase64 ?? "");
  }, [comercioPage, isEditMode]);

  /* ============================================
     MAPA
  ============================================ */

  const mapLatitude = Number(form.lat) || DEFAULT_LATITUDE;

  const mapLongitude = Number(form.lng) || DEFAULT_LONGITUDE;

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div className="commerceFormPage">
      <div className="container-fluid px-0">
        <div className="commerceBackContainer mb-3">
          <ButtonBack route="/app/comercio" />
        </div>

        <div className="commerceFormContainer">
          {/* ====================================
              TABS
          ==================================== */}

          <div className="commerceTabsScroller">
            <Tabs
              value={tab}
              onChange={(_, newValue: number) => setTab(newValue)}
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
                id="commerce-tab-general"
                aria-controls="commerce-tabpanel-0"
                icon={<MaterialSymbol icon="settings" size="small" />}
                iconPosition="start"
                label="General"
                className="commerceTab fz-h4 fw-semibold"
              />

              <Tab
                id="commerce-tab-gallery"
                aria-controls="commerce-tabpanel-1"
                icon={<MaterialSymbol icon="photo_library" size="small" />}
                iconPosition="start"
                label="Galería"
                className="commerceTab fz-h4 fw-semibold"
              />

              <Tab
                id="commerce-tab-schedules"
                aria-controls="commerce-tabpanel-2"
                icon={<MaterialSymbol icon="schedule" size="small" />}
                iconPosition="start"
                label="Horarios"
                className="commerceTab fz-h4 fw-semibold"
              />

              <Tab
                id="commerce-tab-location"
                aria-controls="commerce-tabpanel-3"
                icon={<MaterialSymbol icon="location_on" size="small" />}
                iconPosition="start"
                label="Ubicación"
                className="commerceTab fz-h4 fw-semibold"
              />
            </Tabs>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* ====================================
                GENERAL
            ==================================== */}

            <TabPanel value={tab} index={0} labelledBy="commerce-tab-general">
              <section className="commerceSectionCard">
                <SectionHeader
                  icon="storefront"
                  title="Información general"
                  description="Configura los datos principales que verán tus clientes."
                />

                {/* LOGO */}

                <div className="commerceLogoSection d-flex flex-column flex-sm-row align-items-center gap-3 mb-4">
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
                </div>

                {/* CAMPOS GENERALES */}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <TextField
                      label="Nombre"
                      value={form.nombre ?? ""}
                      onChange={handleChange("nombre")}
                      fullWidth
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <TextField
                      label="Dirección"
                      value={form.direccion ?? ""}
                      onChange={handleChange("direccion")}
                      fullWidth
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <TextField
                      label="Teléfono"
                      value={form.telefono ?? ""}
                      onChange={handleChange("telefono")}
                      fullWidth
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
                    />
                  </div>
                </div>
              </section>

              {/* ====================================
                  REGIÓN
              ==================================== */}

              <section className="commerceSectionCard mt-4">
                <SectionHeader
                  icon="location_city"
                  title="Clasificación y región"
                  description="Selecciona el estado, municipio y giro comercial."
                />

                <div className="row g-3">
                  <div className="col-12 col-md-6 col-lg-4">
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
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
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
                  </div>

                  <div className="col-12 col-lg-4">
                    <SelectTipoComercioAutocomplete
                      value={form.tipoComercioId}
                      onChange={(tipoComercioId) => {
                        setForm((previousForm) => ({
                          ...previousForm,

                          tipoComercioId,
                        }));
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* ====================================
                  COLORES
              ==================================== */}

              {canCustomizeColors && (
                <section className="commerceSectionCard mt-4">
                  <SectionHeader
                    icon="palette"
                    title="Colores de marca"
                    description="Personaliza la apariencia pública de tu comercio."
                  />

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <TextField
                        type="color"
                        label="Color primario"
                        value={form.colorPrimario || "#007AFF"}
                        onChange={handleChange("colorPrimario")}
                        fullWidth
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
              )}
            </TabPanel>

            {/* ====================================
                GALERÍA
            ==================================== */}

            <TabPanel value={tab} index={1} labelledBy="commerce-tab-gallery">
              <section className="commerceSectionCard">
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

                {maxFotos <= 0 && (
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
                      Las imágenes que agregues aparecerán aquí.
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

                          <div className="commerceGalleryActions d-flex align-items-center gap-2">
                            <Button
                              component="label"
                              size="small"
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

            <TabPanel value={tab} index={2} labelledBy="commerce-tab-schedules">
              <div className="commerceSchedulePageHeader">
                <SectionHeader
                  icon="schedule"
                  title="Horarios de atención"
                  description="Indica qué días abre el comercio y sus horas de operación."
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
                            onChange={(horario) =>
                              updateHorario(day.dia, horario)
                            }
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

            <TabPanel value={tab} index={3} labelledBy="commerce-tab-location">
              <section className="commerceSectionCard">
                <SectionHeader
                  icon="map"
                  title="Ubicación en el mapa"
                  description="Selecciona el punto exacto donde se encuentra el comercio."
                />

                <div className="commerceMapInstructions d-flex align-items-center gap-2">
                  <MaterialSymbol icon="touch_app" size="small" />

                  <p className="commerceMapInstructionsText fz-h4 fw-regular mb-0">
                    Presiona sobre el mapa para colocar o mover el marcador.
                  </p>
                </div>

                <div className="commerceMapContainer">
                  <MapContainer
                    center={[mapLatitude, mapLongitude]}
                    zoom={15}
                    className="commerceMap"
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
                </div>

                {form.lat !== 0 && form.lng !== 0 && (
                  <div className="commerceCoordinates d-flex align-items-center gap-2">
                    <MaterialSymbol icon="my_location" size="small" />

                    <span className="commerceCoordinatesText fz-h5 fw-medium">
                      {Number(form.lat).toFixed(6)},{" "}
                      {Number(form.lng).toFixed(6)}
                    </span>
                  </div>
                )}
              </section>
            </TabPanel>

            {/* ====================================
                ACTIONS
            ==================================== */}

            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
              <Button
                type="button"
                variant="outlined"
                className="btn-adlocal--ghost fz-h4 fw-semibold"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="btn-adlocal--solid fz-h4 fw-semibold"
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
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    />

                    <span className="ms-2 fz-h4 fw-semibold">Guardando...</span>
                  </>
                ) : isEditMode ? (
                  "Guardar cambios"
                ) : (
                  "Registrar comercio"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
