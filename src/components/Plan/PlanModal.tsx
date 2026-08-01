import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import type { PlanCreateDto, PlanFormErrors } from "../../services/planApi";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles/PlanModal.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: PlanCreateDto) => Promise<void>;
  plan: PlanCreateDto;
  soloVer?: boolean;
  loading?: boolean;
}

interface SectionHeaderProps {
  icon: string;
  title: string;
  description: string;
}

interface FeatureSwitchProps {
  checked: boolean;
  disabled: boolean;
  icon: string;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
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

const SectionHeader = ({ icon, title, description }: SectionHeaderProps) => {
  return (
    <Box className={styles.sectionHeader}>
      <Box className={styles.sectionIcon}>
        <MaterialSymbol icon={icon} size="medium" />
      </Box>

      <Box className={styles.sectionHeaderText}>
        <Typography component="h3" className={styles.sectionTitle}>
          {title}
        </Typography>

        <Typography component="p" className={styles.sectionDescription}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

const FeatureSwitch = ({
  checked,
  disabled,
  icon,
  label,
  description,
  onChange,
  children,
}: FeatureSwitchProps) => {
  return (
    <Box
      className={[
        styles.featureCard,
        checked ? styles.featureCardActive : "",
        disabled ? styles.featureCardDisabled : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <FormControlLabel
        className={styles.featureControl}
        control={
          <Switch
            checked={checked}
            disabled={disabled}
            className={styles.featureSwitch}
            onChange={(event) => onChange(event.target.checked)}
          />
        }
        label={
          <Box className={styles.featureLabel}>
            <Box className={styles.featureIcon}>
              <MaterialSymbol icon={icon} size="medium" />
            </Box>

            <Box className={styles.featureText}>
              <Typography component="span" className={styles.featureTitle}>
                {label}
              </Typography>

              <Typography component="p" className={styles.featureDescription}>
                {description}
              </Typography>
            </Box>
          </Box>
        }
      />

      {children && <Box className={styles.featureContent}>{children}</Box>}
    </Box>
  );
};

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="plan-modal-title"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
        backdrop: {
          className: styles.dialogBackdrop,
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle id="plan-modal-title" className={styles.dialogTitle}>
          <Box className={styles.titleIcon}>
            <MaterialSymbol
              icon={soloVer ? "visibility" : form.id ? "edit_note" : "add_card"}
              size="large"
            />
          </Box>

          <Box className={styles.titleText}>
            <Typography component="h2" className={styles.title}>
              {modalTitle}
            </Typography>

            <Typography component="p" className={styles.subtitle}>
              {modalDescription}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent className={styles.dialogContent}>
          <Box className={styles.sectionCard}>
            <SectionHeader
              icon="description"
              title="Información general"
              description="Datos principales y configuración de cobro del plan."
            />

            <Stack className={styles.fieldsStack}>
              <TextField
                label="Nombre"
                value={form.nombre}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                disabled={soloVer}
                onChange={updateTextField("nombre")}
                fullWidth
                required
                className={styles.field}
              />

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
                className={styles.field}
              />

              <Box className={styles.twoColumnGrid}>
                <TextField
                  label="Precio"
                  type="number"
                  value={form.precio}
                  disabled={soloVer}
                  error={Boolean(errors.precio)}
                  helperText={errors.precio}
                  onChange={updateNumericField("precio")}
                  fullWidth
                  className={styles.field}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: "0.01",
                    },
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

                <TextField
                  label="Duración"
                  type="number"
                  value={form.duracionDias}
                  disabled={soloVer}
                  error={Boolean(errors.duracionDias)}
                  helperText={errors.duracionDias}
                  onChange={updateNumericField("duracionDias")}
                  fullWidth
                  className={styles.field}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      step: 1,
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">días</InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

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
                className={styles.field}
              >
                <MenuItem value="FREE">Free</MenuItem>

                <MenuItem value="BASIC">Básico</MenuItem>

                <MenuItem value="PRO">Pro</MenuItem>

                <MenuItem value="BUSINESS">Business</MenuItem>
              </TextField>
            </Stack>
          </Box>

          <Divider className={styles.divider} />

          <Box className={styles.sectionCard}>
            <SectionHeader
              icon="tune"
              title="Capacidades"
              description="Define los límites disponibles para los usuarios de este plan."
            />

            <Box className={styles.capacityGrid}>
              <TextField
                label="Máximo de negocios"
                type="number"
                value={form.maxNegocios}
                disabled={soloVer}
                error={Boolean(errors.maxNegocios)}
                helperText={errors.maxNegocios}
                onChange={updateNumericField("maxNegocios")}
                fullWidth
                className={styles.field}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
              />

              <TextField
                label="Productos por negocio"
                type="number"
                value={form.maxProductos}
                disabled={soloVer}
                error={Boolean(errors.maxProductos)}
                helperText={errors.maxProductos}
                onChange={updateNumericField("maxProductos")}
                fullWidth
                className={styles.field}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
              />

              <TextField
                label="Fotos por negocio"
                type="number"
                value={form.maxFotos}
                disabled={soloVer}
                error={Boolean(errors.maxFotos)}
                helperText={errors.maxFotos}
                onChange={updateNumericField("maxFotos")}
                fullWidth
                className={styles.field}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
              />
            </Box>
          </Box>

          <Divider className={styles.divider} />

          <Box className={styles.sectionCard}>
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
              className={styles.field}
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: 100,
                  step: 1,
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">/ 100</InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Divider className={styles.divider} />

          <Box className={styles.sectionCard}>
            <SectionHeader
              icon="extension"
              title="Funciones incluidas"
              description="Activa las herramientas y beneficios disponibles en el plan."
            />

            <Box className={styles.featuresGrid}>
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

              <FeatureSwitch
                checked={form.tieneBadge}
                disabled={soloVer}
                icon="workspace_premium"
                label="Distintivo especial"
                description="Muestra una etiqueta destacada sobre la tarjeta del plan."
                onChange={(checked) =>
                  updateBooleanField("tieneBadge", checked)
                }
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
                    className={styles.field}
                    slotProps={{
                      htmlInput: {
                        maxLength: 40,
                      },
                    }}
                  />
                )}
              </FeatureSwitch>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions className={styles.dialogActions}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className={styles.closeButton}
          >
            {soloVer ? "Cerrar" : "Cancelar"}
          </Button>

          {!soloVer && (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className={styles.saveButton}
              startIcon={
                loading ? undefined : (
                  <MaterialSymbol icon="save" size="small" />
                )
              }
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={18}
                    thickness={4}
                    className={styles.saveProgress}
                  />

                  <span>Guardando...</span>
                </>
              ) : form.id ? (
                "Guardar cambios"
              ) : (
                "Crear plan"
              )}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
