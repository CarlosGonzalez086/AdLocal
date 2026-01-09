import {
  Dialog,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductoServicioDto) => Promise<void>;
  producto: ProductoServicioDto;
  soloVer?: boolean;
  loading?: boolean;
}

export const ProductoServicioModal = ({
  open,
  onClose,
  onSave,
  producto,
  soloVer,
  loading,
}: Props) => {
  const initialForm = useMemo(
    () => ({
      nombre: producto.nombre ?? "",
      descripcion: producto.descripcion ?? "",
      precio: producto.precio ?? 0,
      activo: producto.activo ?? true,
      id: producto.id,
    }),
    [producto]
  );

  const [form, setForm] = useState<ProductoServicioDto>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductoServicioDto, string>>>({});

  const validar = (): boolean => {
    const e: typeof errors = {};
    if (!form.nombre) e.nombre = "Requerido";
    if (form?.precio < 0) e.precio = "Debe ser mayor o igual a 0";
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
        <h4>{soloVer ? "Detalle del Producto/Servicio" : form.id ? "Editar Producto/Servicio" : "Nuevo Producto/Servicio"}</h4>
        <div className="w-100 row gap-3 mt-4">
          {[
            { id: 1, text: "Nombre", field: "nombre" },
            { id: 2, text: "Descripción", field: "descripcion" },
            { id: 3, text: "Precio", field: "precio" },
          ].map((item) => (
            <div className="col-12 w-100" key={item.id}>
              <TextField
                label={item.text}
                type={item.field === "precio" ? "number" : "text"}
                fullWidth
                size="small"
                value={form[item.field as keyof ProductoServicioDto]}
                multiline={item.field == "descripcion" ? true : false}
                error={!!errors[item.field as keyof ProductoServicioDto]}
                helperText={errors[item.field as keyof ProductoServicioDto]}
                disabled={soloVer}
                InputProps={{
                  startAdornment:
                    item.field === "precio" ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : undefined,
                }}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [item.field]:
                      item.field === "precio"
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
