import { TextField, Button, Box, Stack } from "@mui/material";
import { useForm } from "react-hook-form";

interface AdminFormProps {
  onSubmit: (data: any) => Promise<void> | void;
  defaultValues?: any;
  isEdit?: boolean;
}

export default function AdminForm({
  onSubmit,
  defaultValues,
  isEdit = false,
}: AdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
  });

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

        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isEdit ? "Actualizar administrador" : "Crear administrador"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
