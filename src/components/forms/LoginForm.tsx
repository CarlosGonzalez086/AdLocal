import {
  TextField,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "../../schemas/admin.schema";
import { useState } from "react";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
}

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm({
  onSubmit,
  loading = false,
}: LoginFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);

    try {
      await onSubmit(data);
    } catch (error: any) {
      setErrorMsg(
        error?.response?.data?.mensaje ??
          error?.message ??
          "Error al iniciar sesión",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={2}>
        {errorMsg && (
          <Alert severity="error" className="auth-alert">
            {errorMsg}
          </Alert>
        )}

        <TextField
          placeholder="Correo electrónico"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          className="auth-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MaterialSymbol
                  icon="mail"
                  size="small"
                  className="auth-field-icon"
                />
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
          className="auth-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MaterialSymbol
                  icon="lock"
                  size="small"
                  className="auth-field-icon"
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  size="small"
                >
                  <MaterialSymbol
                    icon={showPassword ? "visibility_off" : "visibility"}
                    size="small"
                    className="auth-field-icon"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          type="submit"
          fullWidth
          size="large"
          loading={loading}
          loadingPosition="center"
          className="auth-submit-btn fz-h3 fw-bold"
        >
          Iniciar sesión
        </LoadingButton>
      </Stack>
    </form>
  );
}
