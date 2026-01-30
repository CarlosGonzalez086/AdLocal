import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  InputAdornment,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { PlanCreateDto, PlanFormErrors } from "../../services/planApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: PlanCreateDto) => Promise<void>;
  plan: PlanCreateDto;
  soloVer?: boolean;
  loading?: boolean;
}

const iosColors = {
  primary: "#007AFF",
  background: "#F9FAFB",
};

const defaultForm: PlanCreateDto = {
  nombre: "",
  precio: 0,
  duracionDias: 30,
  tipo: "FREE",

  maxNegocios: 1,
  maxProductos: 0,
  maxFotos: 1,

  nivelVisibilidad: 0,
  permiteCatalogo: false,
  coloresPersonalizados: false,
  tieneBadge: false,
  badgeTexto: null,
  tieneAnalytics: false,
  isMultiUsuario: false,
};

export const PlanModal = ({
  open,
  onClose,
  onSave,
  plan,
  soloVer,
  loading,
}: Props) => {
  const [form, setForm] = useState<PlanCreateDto>(defaultForm);
  const [errors, setErrors] = useState<PlanFormErrors>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ ...defaultForm, ...plan });
    setErrors({});
  }, [plan, open]);

  const validar = (): boolean => {
    const e: PlanFormErrors = {};

    if (!form.nombre) e.nombre = "El nombre es obligatorio";
    if (form.precio < 0) e.precio = "No puede ser negativo";
    if (form.duracionDias <= 0) e.duracionDias = "Debe ser mayor a 0";
    if (form.nivelVisibilidad < 0 || form.nivelVisibilidad > 100)
      e.nivelVisibilidad = "Debe estar entre 0 y 100";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validar()) return;
    await onSave(form);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, backgroundColor: iosColors.background },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {soloVer ? "Detalle del plan" : form.id ? "Editar plan" : "Nuevo plan"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* Básico */}
          <TextField
            label="Nombre"
            value={form.nombre}
            error={!!errors.nombre}
            helperText={errors.nombre}
            disabled={soloVer}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Precio"
              type="number"
              value={form.precio}
              disabled={soloVer}
              error={!!errors.precio}
              helperText={errors.precio}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              onChange={(e) =>
                setForm({ ...form, precio: Number(e.target.value) })
              }
            />

            <TextField
              label="Duración"
              type="number"
              value={form.duracionDias}
              disabled={soloVer}
              error={!!errors.duracionDias}
              helperText={errors.duracionDias}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">días</InputAdornment>
                ),
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  duracionDias: Number(e.target.value),
                })
              }
            />
          </Stack>

          <TextField
            select
            label="Tipo de plan"
            value={form.tipo}
            disabled={soloVer}
            onChange={(e) => setForm({ ...form, tipo: e.target.value as any })}
          >
            <MenuItem value="FREE">Free</MenuItem>
            <MenuItem value="BASIC">Básico</MenuItem>
            <MenuItem value="PRO">Pro</MenuItem>
            <MenuItem value="BUSINESS">Business</MenuItem>
          </TextField>

          <Divider />

          {/* Capacidades */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Max. negocios"
              type="number"
              value={form.maxNegocios}
              disabled={soloVer}
              onChange={(e) =>
                setForm({ ...form, maxNegocios: Number(e.target.value) })
              }
            />
            <TextField
              label="Max. productos"
              type="number"
              value={form.maxProductos}
              disabled={soloVer}
              onChange={(e) =>
                setForm({ ...form, maxProductos: Number(e.target.value) })
              }
            />
            <TextField
              label="Max. fotos"
              type="number"
              value={form.maxFotos}
              disabled={soloVer}
              onChange={(e) =>
                setForm({ ...form, maxFotos: Number(e.target.value) })
              }
            />
          </Stack>

          <Divider />

          {/* Features */}
          <TextField
            label="Nivel de visibilidad (0-100)"
            type="number"
            value={form.nivelVisibilidad}
            error={!!errors.nivelVisibilidad}
            helperText={errors.nivelVisibilidad}
            disabled={soloVer}
            onChange={(e) =>
              setForm({
                ...form,
                nivelVisibilidad: Number(e.target.value),
              })
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.permiteCatalogo}
                disabled={soloVer}
                onChange={(e) =>
                  setForm({
                    ...form,
                    permiteCatalogo: e.target.checked,
                  })
                }
              />
            }
            label="Permite catálogo"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.coloresPersonalizados}
                disabled={soloVer}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coloresPersonalizados: e.target.checked,
                  })
                }
              />
            }
            label="Colores personalizados"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.tieneBadge}
                disabled={soloVer}
                onChange={(e) =>
                  setForm({ ...form, tieneBadge: e.target.checked })
                }
              />
            }
            label="Tiene badge"
          />

          {form.tieneBadge && (
            <TextField
              label="Texto del badge"
              value={form.badgeTexto ?? ""}
              disabled={soloVer}
              onChange={(e) => setForm({ ...form, badgeTexto: e.target.value })}
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={form.tieneAnalytics}
                disabled={soloVer}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tieneAnalytics: e.target.checked,
                  })
                }
              />
            }
            label="Analytics"
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isMultiUsuario}
                disabled={soloVer}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isMultiUsuario: e.target.checked,
                  })
                }
              />
            }
            label="Multiusuario"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cerrar</Button>

        {!soloVer && (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              borderRadius: 3,
              backgroundColor: iosColors.primary,
            }}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
