import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  InputAdornment,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductoServicioDto) => Promise<void>;
  producto: ProductoServicioDto;
  soloVer?: boolean;
  loading?: boolean;
}

const iosColors = {
  primary: "#007AFF",
  background: "#F9FAFB",
  border: "#E5E7EB",
};

export const ProductoServicioModal = ({
  open,
  onClose,
  onSave,
  producto,
  soloVer,
  loading,
}: Props) => {
  const [form, setForm] = useState<ProductoServicioDto>({
    nombre: "",
    descripcion: "",
    precio: 0,
    activo: true,
    stock: 0,
    id: undefined,
    imagenBase64: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductoServicioDto, string>>
  >({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      nombre: producto.nombre ?? "",
      descripcion: producto.descripcion ?? "",
      precio: producto.precio ?? 0,
      activo: producto.activo ?? true,
      stock: producto.stock ?? 0,
      id: producto.id,
      imagenBase64: producto.imagenBase64,
    });

    setPreview(producto.imagenBase64 ?? null);
    setErrors({});
  }, [producto, open]);

  const validar = (): boolean => {
    const e: typeof errors = {};
    if (!form.nombre) e.nombre = "El nombre es obligatorio";
    if (form.precio < 0) e.precio = "Debe ser mayor o igual a 0";
    if (form.stock < 0) e.stock = "Debe ser mayor o igual a 0";
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: iosColors.background,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {soloVer
          ? "Detalle del producto"
          : form.id
            ? "Editar producto"
            : "Nuevo producto"}
      </DialogTitle>

      <DialogContent>
        <Stack alignItems="center" spacing={2} mb={3}>
          <Avatar
            src={preview ?? undefined}
            sx={{
              width: 130,
              height: 130,
              borderRadius: 4,
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            }}
          />

          {!soloVer && (
            <Button
              variant="outlined"
              component="label"
              sx={{
                textTransform: "none",
                borderRadius: 3,
              }}
            >
              Cambiar imagen
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <TextField
            label="Nombre"
            value={form.nombre}
            error={!!errors.nombre}
            helperText={errors.nombre}
            disabled={soloVer}
            fullWidth
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <TextField
            label="Descripción"
            value={form.descripcion}
            multiline
            minRows={3}
            disabled={soloVer}
            fullWidth
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Precio"
              type="number"
              value={form.precio}
              error={!!errors.precio}
              helperText={errors.precio}
              disabled={soloVer}
              fullWidth
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
              label="Stock"
              type="number"
              value={form.stock}
              error={!!errors.stock}
              helperText={errors.stock}
              disabled={soloVer}
              fullWidth
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cerrar
        </Button>

        {!soloVer && (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              backgroundColor: iosColors.primary,
            }}
          >
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
