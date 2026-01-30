import { TextField, Button, Box, Stack } from "@mui/material";
import { useForm } from "react-hook-form";

interface AdminFormProps {
  onSubmit: (data: any) => Promise<void> | void;
  defaultValues?: any;
  type: "admin" | "user";
  isEdit?: boolean;
  isFormCode?: boolean;
}

export default function AdminForm({
  onSubmit,
  defaultValues,
  isEdit = false,
  type,
  isFormCode = false,
}: AdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
  });

  const isAdmin = type === "admin";

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <Stack spacing={3}>
        <TextField
          label="Nombre"
          fullWidth
          {...register("nombre", { required: true })}
        />

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          {...register("email", { required: true })}
        />

        {!isEdit && (
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            {...register("password", { required: true })}
          />
        )}
        {isFormCode && (
          <TextField
            label="¿Tienes un código de referido? Escríbelo aquí"
            type="text"
            fullWidth
            {...register("codigoReferenciado")}
          />
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isEdit
              ? `Actualizar ${isAdmin ? "administrador" : "usuario"}`
              : `Crear ${isAdmin ? "administrador" : "usuario"}`}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
