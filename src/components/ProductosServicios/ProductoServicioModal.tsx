import {
  Dialog,
  DialogContent,
  Box,
  Button,
  Stack,
  TextField,
  Avatar,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#BDBDBD" },
    "&.Mui-focused fieldset": { borderColor: "#007AFF" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#007AFF" },
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
    idComercio: 0,
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
      idComercio: producto.idComercio,
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
          borderRadius: 5,
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            fontWeight={800}
            fontSize="1.1rem"
            color="text.primary"
            letterSpacing="-0.2px"
          >
            {soloVer
              ? "Detalle del producto"
              : form.id
                ? "Editar producto"
                : "Nuevo producto"}
          </Typography>
          <Typography fontSize="0.75rem" color="text.disabled" mt={0.2}>
            {soloVer
              ? "Solo lectura"
              : form.id
                ? "Modifica los datos del producto"
                : "Completa la información"}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            width: 32,
            height: 32,
            borderRadius: 999,
            bgcolor: "rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.09)" },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
        {/* IMAGEN */}
        <Stack alignItems="center" spacing={1.5} mb={3}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={preview ?? undefined}
              sx={{
                width: 110,
                height: 110,
                borderRadius: 4,
                border: "3px solid rgba(255,255,255,0.9)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
              }}
            />
          </Box>

          {!soloVer && (
            <Button
              variant="outlined"
              component="label"
              size="small"
              sx={{
                textTransform: "none",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: "0.8rem",
                borderColor: "rgba(0,0,0,0.15)",
                color: "text.secondary",
                px: 2.5,
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              {form.id ? "Cambiar imagen" : "Subir imagen"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 2.5, opacity: 0.5 }} />

        {/* CAMPOS */}
        <Stack spacing={2}>
          <TextField
            label="Nombre"
            value={form.nombre}
            error={!!errors.nombre}
            helperText={errors.nombre}
            disabled={soloVer}
            fullWidth
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            sx={fieldSx}
          />

          <TextField
            label="Descripción"
            value={form.descripcion}
            multiline
            minRows={3}
            disabled={soloVer}
            fullWidth
            inputProps={{ maxLength: 250 }}
            helperText={
              <Box
                component="span"
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Typography
                  component="span"
                  fontSize="0.72rem"
                  color={
                    form.descripcion.length > 220
                      ? "error.main"
                      : "text.disabled"
                  }
                  fontWeight={600}
                >
                  {form.descripcion.length} / 250
                </Typography>
              </Box>
            }
            onChange={(e) => {
              if (e.target.value.length > 250) return;
              setForm({ ...form, descripcion: e.target.value });
            }}
            sx={fieldSx}
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
              inputProps={{ min: 0, step: "any" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      fontWeight={600}
                      color="text.secondary"
                      fontSize="0.9rem"
                    >
                      $
                    </Typography>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 0) return;
                setForm({ ...form, precio: value });
              }}
              sx={fieldSx}
            />

            <TextField
              label="Stock"
              type="number"
              value={form.stock}
              error={!!errors.stock}
              helperText={errors.stock}
              disabled={soloVer}
              fullWidth
              inputProps={{ min: 0, step: 1 }}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 0) return;
                setForm({ ...form, stock: value });
              }}
              sx={fieldSx}
            />
          </Stack>
        </Stack>
      </DialogContent>

      {/* FOOTER */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          mt: 1,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            borderColor: "rgba(0,0,0,0.15)",
            color: "text.secondary",
            border: "1px solid rgba(0,0,0,0.15)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          Cerrar
        </Button>

        {!soloVer && (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              px: 4,
              py: 1.1,
              background: "linear-gradient(135deg, #007AFF, #005FCC)",
              boxShadow: "0 6px 18px rgba(0,122,255,0.30)",
              transition: "all 0.25s ease",
              "&:hover": {
                boxShadow: "0 10px 24px rgba(0,122,255,0.42)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            {loading ? (
              <CircularProgress
                size={18}
                thickness={4}
                sx={{ color: "#fff" }}
              />
            ) : (
              "Guardar"
            )}
          </Button>
        )}
      </Box>
    </Dialog>
  );
};
