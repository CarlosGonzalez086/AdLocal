import {
  TextField,
  Box,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useState } from "react";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

interface FormRegisterProps {
  onSubmit: (data: any) => Promise<void> | void;
  defaultValues?: any;
  type: "admin" | "user";
  isEdit?: boolean;
  isFormCode?: boolean;
  loading?: boolean;
}

export default function FormRegister({
  onSubmit,
  defaultValues,
  isEdit = false,
  type,
  isFormCode = false,
  loading = false,
}: FormRegisterProps) {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const isAdmin = type === "admin";

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <Stack spacing={2}>
        <TextField
          placeholder="Nombre"
          fullWidth
          className="auth-field"
          {...register("nombre", { required: true })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MaterialSymbol
                  icon="person"
                  size="small"
                  className="auth-field-icon"
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          placeholder="Correo electrónico"
          type="email"
          fullWidth
          className="auth-field"
          {...register("email", { required: true })}
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

        {!isEdit && (
          <TextField
            placeholder="Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            className="auth-field"
            {...register("password", { required: true })}
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
        )}

        {isFormCode && (
          <TextField
            placeholder="Código de referido (opcional)"
            fullWidth
            className="auth-field"
            {...register("codigoReferenciado")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MaterialSymbol
                    icon="redeem"
                    size="small"
                    className="auth-field-icon"
                  />
                </InputAdornment>
              ),
            }}
          />
        )}

        <LoadingButton
          type="submit"
          fullWidth
          size="large"
          loading={loading}
          loadingPosition="center"
          className="auth-submit-btn fz-h3 fw-bold"
        >
          {isEdit
            ? `Actualizar ${isAdmin ? "administrador" : "usuario"}`
            : `Crear ${isAdmin ? "administrador" : "cuenta"}`}
        </LoadingButton>
      </Stack>
    </Box>
  );
}
