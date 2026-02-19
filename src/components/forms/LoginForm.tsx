import {
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "../../schemas/admin.schema";
import { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      await onSubmit(data);
    } catch (error: any) {
      setErrorMsg(
        error?.response?.data?.mensaje ||
          error?.message ||
          "Error al iniciar sesión"
      );
    }
  };

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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={2}>
        {errorMsg && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <TextField
          placeholder="Email"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          placeholder="Contraseña"
          type={showPassword ? "text" : "password"}
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={fieldSx}
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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          size="large"
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 16,
            bgcolor: "#1A1A1A",
            py: 1.5,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#333",
              boxShadow: "none",
            },
          }}
        >
          {isSubmitting ? "Entrando..." : "Login"}
        </Button>
      </Stack>
    </form>
  );
}