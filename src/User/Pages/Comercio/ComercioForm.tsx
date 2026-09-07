import { Button, Tab, Tabs } from "@mui/material";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Swal from "../../../utils/sweetalert";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import type {
  ComercioDto,
  HorarioComercioDto,
} from "../../../types/User/comercio";
import type { JwtPayload } from "../../Auth/PrivateRouteUsuario";
import {
  ComercioTabGeneral,
  type EditableTextField,
} from "./Components/ComercioTabGeneral";
import { ComercioTabGaleria } from "./Components/ComercioTabGaleria";
import { ComercioTabHorarios } from "./Components/ComercioTabHorarios";
import { ComercioTabUbicacion } from "./Components/ComercioTabUbicacion";

/* ============================================
   TYPES
============================================ */

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

/* ============================================
   HELPERS
============================================ */

const normalizarHorarios = (
  horarios: HorarioComercioDto[] = [],
): HorarioComercioDto[] =>
  Array.from({ length: 7 }, (_, index) => {
    const dia = index + 1;
    const horarioExistente = horarios.find((item) => item.dia === dia);

    return (
      horarioExistente ?? {
        id: 0,
        dia,
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
  activo: initialData?.activo ?? false,
  lat: initialData?.lat ?? 0,
  lng: initialData?.lng ?? 0,
  logoBase64: initialData?.logoBase64 ?? "",
  imagenes: initialData?.imagenes ?? [],
  colorPrimario: initialData?.colorPrimario || "#008989",
  colorSecundario: initialData?.colorSecundario || "#E7692C",
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
      reject(new Error("No fue posible leer la imagen seleccionada."));
    };
    reader.onerror = () => {
      reject(new Error("Ocurrió un error al leer la imagen."));
    };
    reader.readAsDataURL(file);
  });

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
  const editable = soloVer;

  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<ComercioDto>(() =>
    createFormState(initialData),
  );
  const [preview, setPreview] = useState<string | null>(
    initialData?.logoBase64 ?? null,
  );
  const [galeria, setGaleria] = useState<string[]>(initialData?.imagenes ?? []);

  const maxFotos = getPositiveInteger(user?.maxFotos);
  const remainingImages = Math.max(maxFotos - galeria.length, 0);
  const canUploadImages = editable && remainingImages > 0;

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

  const showImageErrorAlert = async (title: string, text: string) => {
    await Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonText: "Entendido",
    });
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !editable) return;

    if (!isImageFile(file)) {
      await Swal.fire({
        icon: "warning",
        title: "Archivo no válido",
        text: "Selecciona un archivo de imagen.",
        confirmButtonText: "Entendido",
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
      await showImageErrorAlert(
        "No se pudo cargar el logo",
        "Intenta seleccionar otra imagen.",
      );
    }
  };

  const handleGaleriaChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0 || !editable) return;

    if (remainingImages <= 0) {
      await Swal.fire({
        icon: "info",
        title: "Límite alcanzado",
        text: `Tu plan permite un máximo de ${maxFotos} imágenes en la galería.`,
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const availableFiles = files.slice(0, remainingImages);
    const validFiles = availableFiles.filter(isImageFile);

    if (validFiles.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Archivos no válidos",
        text: "Selecciona uno o más archivos de imagen.",
        confirmButtonText: "Entendido",
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

  const handleReplaceImage = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !editable) return;
    if (!isImageFile(file)) {
      await showImageErrorAlert("Archivo no válido", "Selecciona una imagen válida.");
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
      console.error("Error al reemplazar imagen:", error);
      await showImageErrorAlert(
        "No se pudo reemplazar la imagen",
        "Intenta seleccionar otra imagen.",
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    setGaleria((currentGallery) =>
      currentGallery.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const handleLocationChange = (latitude: number, longitude: number) => {
    setForm((previousForm) => ({
      ...previousForm,
      lat: latitude,
      lng: longitude,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    await onSave({
      ...form,
      logoBase64: preview ?? "",
      imagenes: galeria,
    });
  };

  const mapLatitude = Number(form.lat) || 19.4326;
  const mapLongitude = Number(form.lng) || -99.1332;
  const hasSelectedLocation = Boolean(Number(form.lat) && Number(form.lng));

  return (
    <div className="commerceFormContainer">
      <div className="commerceFormCard">
        <form onSubmit={handleSubmit} noValidate>
          <div className="commerceTabsContainer">
            <Tabs
              value={tab}
              onChange={(_, nextTab) => setTab(nextTab)}
              variant="scrollable"
              scrollButtons="auto"
              className="commerceTabs"
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

          <TabPanel
            value={tab}
            index={0}
            labelledBy="commerce-form-tab-general"
          >
            <ComercioTabGeneral
              form={form}
              setForm={setForm}
              editable={editable}
              preview={preview}
              handleImageChange={handleImageChange}
              handleChange={handleChange}
            />
          </TabPanel>

          <TabPanel
            value={tab}
            index={1}
            labelledBy="commerce-form-tab-gallery"
          >
            <ComercioTabGaleria
              editable={editable}
              canUploadImages={canUploadImages}
              galeria={galeria}
              maxFotos={maxFotos}
              handleGaleriaChange={handleGaleriaChange}
              handleReplaceImage={handleReplaceImage}
              handleRemoveImage={handleRemoveImage}
            />
          </TabPanel>

          <TabPanel
            value={tab}
            index={2}
            labelledBy="commerce-form-tab-schedules"
          >
            <ComercioTabHorarios
              horarios={form.horarios}
              editable={editable}
              updateHorario={updateHorario}
            />
          </TabPanel>

          <TabPanel
            value={tab}
            index={3}
            labelledBy="commerce-form-tab-location"
          >
            <ComercioTabUbicacion
              editable={editable}
              lat={Number(form.lat) || 0}
              lng={Number(form.lng) || 0}
              mapLatitude={mapLatitude}
              mapLongitude={mapLongitude}
              hasSelectedLocation={hasSelectedLocation}
              handleLocationChange={handleLocationChange}
            />
          </TabPanel>

          {editable && (
            <div className="commerceFormActions d-flex justify-content-end gap-3 mt-4">
              {setEditando && (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={setEditando}
                  disabled={loading}
                  className="commerceCancelButton fz-h4 fw-semibold"
                >
                  Cancelar
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
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

export default ComercioForm;
