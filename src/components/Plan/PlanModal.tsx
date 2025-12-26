import { Dialog, DialogActions, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import type { PlanCreateDto } from "../../services/planApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: PlanCreateDto) => void;
  plan: PlanCreateDto;
  soloVer?: boolean;
}

export const PlanModal = ({ open, onClose, onSave, plan, soloVer }: Props) => {
  const initialForm: PlanCreateDto = plan ?? {
    nombre: "",
    precio: 0,
    duracionDias: 0,
    tipo: "",
  };

  const [form, setForm] = useState<PlanCreateDto>(initialForm);

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (plan) setForm(plan);
  }, [plan]);

  const validar = () => {
    const e: any = {};
    if (!form.nombre) e.nombre = "Requerido";
    if (form.precio <= 0) e.precio = "Mayor a 0";
    if (form.duracionDias <= 0) e.duracionDias = "Mayor a 0";
    if (!form.tipo) e.tipo = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validar()) return;
    onSave(form);
    onClose();
  };

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
          {["nombre", "precio", "duracionDias", "tipo"].map((field) => (
            <div className="col-12 w-100" key={field}>
              <TextField
                label={field}
                type={
                  field !== "nombre" && field !== "tipo" ? "number" : "text"
                }
                fullWidth
                size="small"
                value={(form as any)[field]}
                error={!!errors[field]}
                helperText={errors[field]}
                disabled={soloVer}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        {!soloVer && (
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
