import {
  Dialog,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { useState } from "react";
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
  const [form, setForm] = useState<ProductoServicioDto>({
    nombre: producto.nombre ?? "",
    descripcion: producto.descripcion ?? "",
    precio: producto.precio ?? 0,
    activo: producto.activo ?? true,
    stock: producto.stock ?? 0,
    id: producto.id,
    imagenBase64: producto.imagenBase64,
  });

  const [preview, setPreview] = useState<string | null>(
    producto.imagenBase64 ?? null
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductoServicioDto, string>>
  >({});

  const validar = (): boolean => {
    const e: typeof errors = {};
    if (!form.nombre) e.nombre = "Requerido";
    if ((form?.precio ?? 0) < 0) e.precio = "Debe ser mayor o igual a 0";
    if ((form?.stock ?? 0) < 0) e.stock = "Debe ser mayor o igual a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validar()) return;
    await onSave(form);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setForm({ ...form, imagenBase64: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="w-100 p-3">
        <h4>
          {soloVer
            ? "Detalle del Producto/Servicio"
            : form.id
            ? "Editar Producto/Servicio"
            : "Nuevo Producto/Servicio"}
        </h4>
        <div className="d-flex flex-column align-items-center mb-4">
          <Avatar
            src={preview ?? undefined}
            sx={{ width: 120, height: 120, mb: 2 }}
          />

          <Button variant="outlined" component="label">
            Cargar Imagen
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </div>
        <div className="w-100 row gap-3 mt-4">
          {[
            { id: 1, text: "Nombre", field: "nombre" },
            { id: 2, text: "Descripción", field: "descripcion" },
            { id: 3, text: "Precio", field: "precio" },
            { id: 4, text: "Stock", field: "stock" },
          ].map((item) => (
            <div className="col-12 w-100" key={item.id}>
              <TextField
                label={item.text}
                type={
                  item.field === "precio" || item.field === "stock"
                    ? "number"
                    : "text"
                }
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
                      item.field === "precio" || item.field === "stock"
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
