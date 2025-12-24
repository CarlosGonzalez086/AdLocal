import { TextField, Button, Alert, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "../../schemas/admin.schema";
import { useState } from "react";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={2}>
        {errorMsg && (
          <Alert severity="error">
            {errorMsg}
          </Alert>
        )}

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          size="large"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </Stack>
    </form>
  );
}
