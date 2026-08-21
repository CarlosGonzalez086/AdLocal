import {
  Box,
  Divider,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import type { PlanCreateDto, PlanFormErrors } from "../../../../types/Admin/planes";
import { GenericModal } from "../../../../components/GenericModal";
import SectionHeader from "../../../../components/SectionHeader";
import FeatureSwitch from "../../../../components/FeatureSwitch";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: PlanCreateDto) => Promise<void>;
  plan: PlanCreateDto;
  soloVer?: boolean;
  loading?: boolean;
}

type NumericPlanField =
  | "precio"
  | "duracionDias"
  | "maxNegocios"
  | "maxProductos"
  | "maxFotos"
  | "nivelVisibilidad";

type TextPlanField = "nombre" | "stripePriceId" | "badgeTexto";

const defaultForm: PlanCreateDto = {
  nombre: "",
  precio: 0,
  duracionDias: 30,
  tipo: "FREE",
  maxNegocios: 1,
  maxProductos: 0,
  maxFotos: 1,
  stripePriceId: "",
  nivelVisibilidad: 0,
  permiteCatalogo: false,
  coloresPersonalizados: false,
  tieneBadge: false,
  badgeTexto: null,
  tieneAnalytics: false,
  isMultiUsuario: false,
};

const normalizeForm = (plan?: PlanCreateDto | null): PlanCreateDto => ({
  ...defaultForm,
  ...(plan ?? {}),
  nombre: plan?.nombre ?? "",
  precio: Number(plan?.precio ?? 0),
  duracionDias: Number(plan?.duracionDias ?? 30),
  tipo: plan?.tipo ?? "FREE",
  maxNegocios: Number(plan?.maxNegocios ?? 1),
  maxProductos: Number(plan?.maxProductos ?? 0),
  maxFotos: Number(plan?.maxFotos ?? 1),
  stripePriceId: plan?.stripePriceId ?? "",
  nivelVisibilidad: Number(plan?.nivelVisibilidad ?? 0),
  permiteCatalogo: plan?.permiteCatalogo ?? false,
  coloresPersonalizados: plan?.coloresPersonalizados ?? false,
  tieneBadge: plan?.tieneBadge ?? false,
  badgeTexto: plan?.badgeTexto ?? null,
  tieneAnalytics: plan?.tieneAnalytics ?? false,
  isMultiUsuario: plan?.isMultiUsuario ?? false,
});

export const PlanModal = ({
  open,
  onClose,
  onSave,
  plan,
  soloVer = false,
  loading = false,
}: Props) => {
  const [form, setForm] = useState<PlanCreateDto>(() => normalizeForm(plan));

  const [errors, setErrors] = useState<PlanFormErrors>({});

  const modalTitle = useMemo(() => {
    if (soloVer) {
      return "Detalle del plan";
    }

    return form.id ? "Editar plan" : "Nuevo plan";
  }, [form.id, soloVer]);

  const modalDescription = soloVer
    ? "Consulta la configuración y capacidades incluidas en este plan."
    : form.id
      ? "Actualiza la configuración, límites y beneficios del plan."
      : "Configura un nuevo plan para los usuarios de la plataforma.";

  useEffect(() => {
    if (!open) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(normalizeForm(plan));
    setErrors({});
  }, [open, plan]);

  const updateTextField =
    (field: TextPlanField) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setForm((currentForm) => ({
        ...currentForm,
        [field]: field === "badgeTexto" ? value || null : value,
      }));

      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    };

  const updateNumericField =
    (field: NumericPlanField) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value === "" ? 0 : Number(event.target.value);

      setForm((currentForm) => ({
        ...currentForm,
        [field]: Number.isFinite(value) ? value : 0,
      }));

      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    };

  const updateBooleanField = (
    field:
      | "permiteCatalogo"
      | "coloresPersonalizados"
      | "tieneBadge"
      | "tieneAnalytics"
      | "isMultiUsuario",
    checked: boolean,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: checked,

      ...(field === "tieneBadge" &&
        !checked && {
          badgeTexto: null,
        }),
    }));

    if (field === "tieneBadge" && !checked) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        badgeTexto: undefined,
      }));
    }
  };

  const validar = (): boolean => {
    const nextErrors: PlanFormErrors = {};

    if (!form.nombre.trim()) {
      nextErrors.nombre = "El nombre es obligatorio";
    }

    if (!Number.isFinite(form.precio) || form.precio < 0) {
      nextErrors.precio = "El precio no puede ser negativo";
    }

    if (!Number.isInteger(form.duracionDias) || form.duracionDias <= 0) {
      nextErrors.duracionDias = "La duración debe ser mayor a 0";
    }

    if (!Number.isInteger(form.maxNegocios) || form.maxNegocios < 0) {
      nextErrors.maxNegocios = "Debe ser 0 o mayor";
    }

    if (!Number.isInteger(form.maxProductos) || form.maxProductos < 0) {
      nextErrors.maxProductos = "Debe ser 0 o mayor";
    }

    if (!Number.isInteger(form.maxFotos) || form.maxFotos < 0) {
      nextErrors.maxFotos = "Debe ser 0 o mayor";
    }

    if (
      !Number.isFinite(form.nivelVisibilidad) ||
      form.nivelVisibilidad < 0 ||
      form.nivelVisibilidad > 100
    ) {
      nextErrors.nivelVisibilidad = "Debe estar entre 0 y 100";
    }

    if (form.tieneBadge && !form.badgeTexto?.trim()) {
      nextErrors.badgeTexto = "Escribe el texto del distintivo";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (soloVer || loading || !validar()) {
      return;
    }

    await onSave({
      ...form,
      nombre: form.nombre.trim(),
      stripePriceId: form.stripePriceId?.trim() ?? "",
      badgeTexto: form.tieneBadge ? form.badgeTexto?.trim() || null : null,
    });

    onClose();
  };

  return (
    <GenericModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      icon={soloVer ? "visibility" : form.id ? "edit_note" : "add_card"}
      title={modalTitle}
      subtitle={modalDescription}
      loading={loading}
      maxWidth="md"
      secondaryLabel={soloVer ? "Cerrar" : "Cancelar"}
      primaryAction={
        soloVer
          ? undefined
          : {
              type: "submit",
              label: form.id ? "Guardar cambios" : "Crear plan",
              loadingLabel: "Guardando...",
              icon: "save",
            }
      }
    >
      <Box className="card-adlocal mt-3">
        <SectionHeader
          icon="description"
          title="Información general"
          description="Datos principales y configuración de cobro del plan."
        />

        <div className="row p-3">
          <div className="col-12 mb-3">
            <TextField
              label="Nombre"
              value={form.nombre}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
              disabled={soloVer}
              onChange={updateTextField("nombre")}
              fullWidth
              required
            />
          </div>
          <div className="col-12 mb-3">
            <TextField
              label="Stripe Price ID"
              value={form.stripePriceId ?? ""}
              error={Boolean(errors.stripePriceId)}
              helperText={
                errors.stripePriceId ||
                "Identificador del precio creado en Stripe."
              }
              disabled={soloVer}
              onChange={updateTextField("stripePriceId")}
              fullWidth
            />
          </div>
        </div>
        <div className="row p-3">
          <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
            <TextField
              label="Precio"
              type="number"
              value={form.precio}
              disabled={soloVer}
              error={Boolean(errors.precio)}
              helperText={errors.precio}
              onChange={updateNumericField("precio")}
              fullWidth
              slotProps={{
                htmlInput: { min: 0, step: "0.01" },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">MXN</InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
            <TextField
              label="Duración"
              type="number"
              value={form.duracionDias}
              disabled={soloVer}
              error={Boolean(errors.duracionDias)}
              helperText={errors.duracionDias}
              onChange={updateNumericField("duracionDias")}
              fullWidth
              slotProps={{
                htmlInput: { min: 1, step: 1 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">días</InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className="col-lg-12 col-md-6 col-sm-12">
            <TextField
              select
              label="Tipo de plan"
              value={form.tipo}
              disabled={soloVer}
              onChange={(event) => {
                setForm((currentForm) => ({
                  ...currentForm,
                  tipo: event.target.value as PlanCreateDto["tipo"],
                }));
              }}
              fullWidth
            >
              <MenuItem value="FREE">Free</MenuItem>
              <MenuItem value="BASIC">Básico</MenuItem>
              <MenuItem value="PRO">Pro</MenuItem>
              <MenuItem value="BUSINESS">Business</MenuItem>
            </TextField>
          </div>
        </div>
      </Box>

      <Divider className="divider" />

      <Box className="card-adlocal">
        <SectionHeader
          icon="tune"
          title="Capacidades"
          description="Define los límites disponibles para los usuarios de este plan."
        />

        <div className="row g-3">
          <div className="col-12 col-sm-4">
            <TextField
              label="Máximo de negocios"
              type="number"
              value={form.maxNegocios}
              disabled={soloVer}
              error={Boolean(errors.maxNegocios)}
              helperText={errors.maxNegocios}
              onChange={updateNumericField("maxNegocios")}
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />
          </div>

          <div className="col-12 col-sm-4">
            <TextField
              label="Productos por negocio"
              type="number"
              value={form.maxProductos}
              disabled={soloVer}
              error={Boolean(errors.maxProductos)}
              helperText={errors.maxProductos}
              onChange={updateNumericField("maxProductos")}
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />
          </div>

          <div className="col-12 col-sm-4">
            <TextField
              label="Fotos por negocio"
              type="number"
              value={form.maxFotos}
              disabled={soloVer}
              error={Boolean(errors.maxFotos)}
              helperText={errors.maxFotos}
              onChange={updateNumericField("maxFotos")}
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />
          </div>
        </div>
      </Box>

      <Divider className="divider" />

      <Box className="card-adlocal">
        <SectionHeader
          icon="visibility"
          title="Visibilidad"
          description="Controla la prioridad con la que se mostrará el plan."
        />

        <TextField
          label="Nivel de visibilidad"
          type="number"
          value={form.nivelVisibilidad}
          error={Boolean(errors.nivelVisibilidad)}
          helperText={
            errors.nivelVisibilidad || "Valor permitido entre 0 y 100."
          }
          disabled={soloVer}
          onChange={updateNumericField("nivelVisibilidad")}
          fullWidth
          slotProps={{
            htmlInput: { min: 0, max: 100, step: 1 },
            input: {
              endAdornment: (
                <InputAdornment position="end">/ 100</InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Divider className="divider" />

      <Box className="card-adlocal">
        <SectionHeader
          icon="extension"
          title="Funciones incluidas"
          description="Activa las herramientas y beneficios disponibles en el plan."
        />

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FeatureSwitch
              checked={form.permiteCatalogo}
              disabled={soloVer}
              icon="inventory_2"
              label="Catálogo público"
              description="Permite publicar productos y servicios."
              onChange={(checked) =>
                updateBooleanField("permiteCatalogo", checked)
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <FeatureSwitch
              checked={form.coloresPersonalizados}
              disabled={soloVer}
              icon="palette"
              label="Colores personalizados"
              description="Permite modificar la identidad visual del comercio."
              onChange={(checked) =>
                updateBooleanField("coloresPersonalizados", checked)
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <FeatureSwitch
              checked={form.tieneAnalytics}
              disabled={soloVer}
              icon="monitoring"
              label="Analytics"
              description="Incluye estadísticas y métricas de visitas."
              onChange={(checked) =>
                updateBooleanField("tieneAnalytics", checked)
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <FeatureSwitch
              checked={form.isMultiUsuario}
              disabled={soloVer}
              icon="group"
              label="Multiusuario"
              description="Permite agregar colaboradores al negocio."
              onChange={(checked) =>
                updateBooleanField("isMultiUsuario", checked)
              }
            />
          </div>

          <div className="col-12">
            <FeatureSwitch
              checked={form.tieneBadge}
              disabled={soloVer}
              icon="workspace_premium"
              label="Distintivo especial"
              description="Muestra una etiqueta destacada sobre la tarjeta del plan."
              onChange={(checked) => updateBooleanField("tieneBadge", checked)}
            >
              {form.tieneBadge && (
                <TextField
                  label="Texto del distintivo"
                  value={form.badgeTexto ?? ""}
                  disabled={soloVer}
                  error={Boolean(errors.badgeTexto)}
                  helperText={
                    errors.badgeTexto || "Ejemplo: Más popular o Recomendado."
                  }
                  onChange={updateTextField("badgeTexto")}
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 40 } }}
                />
              )}
            </FeatureSwitch>
          </div>
        </div>
      </Box>
    </GenericModal>
  );
};
