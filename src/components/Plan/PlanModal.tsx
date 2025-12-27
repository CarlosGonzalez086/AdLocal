import { Dialog, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";
import type { PlanCreateDto } from "../../services/planApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: PlanCreateDto) => void;
  plan: PlanCreateDto;
  soloVer?: boolean;
}

export const PlanModal = ({ open, onClose, onSave, plan, soloVer }: Props) => {
  const initialForm: PlanCreateDto = {
    nombre: plan.nombre,
    precio: plan.precio,
    duracionDias: plan.duracionDias,
    tipo: plan.tipo,
  };

  const [form, setForm] = useState<PlanCreateDto>(initialForm);

  const [errors, setErrors] = useState<any>({});

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

  console.log(form);
  

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
                value={[item.field]}
                error={!!errors[item.field]}
                helperText={errors[item.field]}
                disabled={soloVer}
                onChange={(e) =>
                  setForm({ ...form, [item.field]: e.target.value })
                }
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
