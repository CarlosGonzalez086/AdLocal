import {
  TextField,
  Button,
  Box,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

interface AdminFormProps {
  onSubmit: (data: any) => Promise<void> | void;
  defaultValues?: any;
  type: "admin" | "user";
  isEdit?: boolean;
  isFormCode?: boolean;
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

export default function AdminForm({
  onSubmit,
  defaultValues,
  isEdit = false,
  type,
  isFormCode = false,
}: AdminFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  const isAdmin = type === "admin";

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <Stack spacing={2}>
        <TextField
          placeholder="Nombre"
          fullWidth
          sx={fieldSx}
          {...register("nombre", { required: true })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          placeholder="Correo electrónico"
          type="email"
          fullWidth
          sx={fieldSx}
          {...register("email", { required: true })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        {!isEdit && (
          <TextField
            placeholder="Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            sx={fieldSx}
            {...register("password", { required: true })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        {isFormCode && (
          <TextField
            placeholder="Código de referido (opcional)"
            type="text"
            fullWidth
            sx={fieldSx}
            {...register("codigoReferenciado")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CardGiftcardOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 16,
            bgcolor: "#1A1A1A",
            py: 1.5,
            mt: 1,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#333",
              boxShadow: "none",
            },
          }}
        >
          {isSubmitting
            ? "Procesando..."
            : isEdit
            ? `Actualizar ${isAdmin ? "administrador" : "usuario"}`
            : `Crear ${isAdmin ? "administrador" : "cuenta"}`}
        </Button>
      </Stack>
    </Box>
  );
}