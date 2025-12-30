import {
  Dialog,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { PlanCreateDto, PlanFormErrors } from "../../services/planApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: PlanCreateDto) => Promise<void>;
  plan: PlanCreateDto;
  soloVer?: boolean;
  loading?:boolean;
}

export const PlanModal = ({ open, onClose, onSave, plan, soloVer,loading }: Props) => {
  const initialForm = useMemo(
    () => ({
      nombre: plan.nombre ?? "",
      precio: plan.precio ?? 0,
      duracionDias: plan.duracionDias ?? 0,
      tipo: plan.tipo ?? "",
      id: plan.id,
    }),
    [plan]
  );
  const [form, setForm] = useState<PlanCreateDto>(initialForm);
  const [errors, setErrors] = useState<PlanFormErrors>({});

  const validar = (): boolean => {
    const e: PlanFormErrors = {};

    if (!form.nombre) e.nombre = "Requerido";
    if (form.precio <= 0) e.precio = "Mayor a 0";
    if (form.duracionDias <= 0) e.duracionDias = "Mayor a 0";
    if (!form.tipo) e.tipo = "Requerido";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validar()) return;

    await onSave(form);
    onClose();
  };

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialForm);
      setErrors({});
    }
  }, [initialForm, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="w-100 p-3">
        <h4>
          {" "}
          {soloVer
            ? "Detalle del Plan"
            : form.id
            ? "Editar Plan"
            : "Nuevo Plan"}
        </h4>
        <div className="w-100 row gap-3 mt-4">
          {[
            { id: 1, text: "Nombre", field: "nombre" },
            { id: 2, text: "Precio", field: "precio" },
            { id: 3, text: "Duracion de dias", field: "duracionDias" },
            { id: 4, text: "Tipo", field: "tipo" },
          ].map((item) => (
            <div className="col-12 w-100" key={item.id}>
              <TextField
                label={item.text}
                type={
                  item.field !== "nombre" && item.field !== "tipo"
                    ? "number"
                    : "text"
                }
                fullWidth
                size="small"
                value={form[item.field as keyof PlanCreateDto]}
                error={!!errors[item.field as keyof PlanCreateDto]}
                helperText={errors[item.field as keyof PlanCreateDto]}
                disabled={soloVer}
                InputProps={{
                  startAdornment:
                    item.field === "precio" ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : undefined,

                  endAdornment:
                    item.field === "duracionDias" ? (
                      <InputAdornment position="end">días</InputAdornment>
                    ) : undefined,
                }}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [item.field]:
                      item.field === "precio" || item.field === "duracionDias"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        {!soloVer && (
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
