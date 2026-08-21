import {
  Avatar,
  Box,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type {
  SuscripcionDto,
  UsuarioDto,
} from "../../../../types/Admin/usuarios";
import { GenericModal } from "../../../../components/GenericModal";

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioDto;
  suscripcion?: SuscripcionDto;
  soloVer?: boolean;
}

const getStatusLabel = (status: SuscripcionDto["status"]) => {
  switch (status) {
    case "active":
      return "Activa";
    case "canceling":
      return "Cancelada al finalizar el periodo";
    case "canceled":
      return "Cancelada";
    default:
      return status;
  }
};

const getStatusColor = (status: SuscripcionDto["status"]) => {
  switch (status) {
    case "active":
      return "success";
    case "canceling":
      return "warning";
    case "canceled":
      return "default";
    default:
      return "default";
  }
};

export const UserModal = ({
  open,
  onClose,
  usuario,
  suscripcion,
  soloVer,
}: Props) => {
  const initialForm = useMemo(
    () => ({
      id: usuario.id,
      nombre: usuario.nombre ?? "",
      email: usuario.email ?? "",
      fotoUrl: usuario.fotoUrl ?? null,
      fechaCreacion: usuario.fechaCreacion ?? "",
    }),
    [usuario],
  );

  const [form, setForm] = useState<UsuarioDto>(initialForm);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialForm);
    }
  }, [initialForm, open]);

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      icon="person"
      title={soloVer ? "Información del usuario" : "Editar usuario"}
      subtitle="Datos de la cuenta y su suscripción actual."
      maxWidth="sm"
      secondaryLabel="Cerrar"
    >
      <Box className="card-adlocal mt-3">
        <Avatar src={form.fotoUrl ?? undefined} className="avatar">
          {!form.fotoUrl && form.nombre?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography className="fz-h3 fw-bold">{form.nombre}</Typography>
      </Box>

      <Divider className="divider" />

      <Box className="card-adlocal mt-3">
        <TextField label="Nombre" value={form.nombre} disabled fullWidth />
        <TextField
          label="Correo electrónico"
          value={form.email}
          disabled
          fullWidth
        />

        {form.fechaCreacion && (
          <TextField
            label="Fecha de creación"
            value={new Date(form.fechaCreacion).toLocaleDateString()}
            disabled
            fullWidth
          />
        )}
      </Box>

      {suscripcion && (
        <>
          <Divider className="divider" />

          <Box className="card-adlocal mt-3">
            <TextField
              label="Plan"
              value={suscripcion.plan.nombre}
              disabled
              fullWidth
            />

            <Stack spacing={0.5}>
              <Typography className="fz-h5 fw-regular" color="text.secondary">
                Estado de la suscripción
              </Typography>
              <Chip
                size="small"
                label={getStatusLabel(suscripcion.status)}
                color={getStatusColor(suscripcion.status)}
                sx={{ alignSelf: "flex-start" }}
              />
            </Stack>

            <TextField
              label="Renovación"
              value={
                suscripcion.autoRenew
                  ? "Renovación automática"
                  : "No se renovará automáticamente"
              }
              disabled
              fullWidth
            />

            <TextField
              label="Inicio del periodo"
              value={new Date(
                suscripcion.currentPeriodStart,
              ).toLocaleDateString()}
              disabled
              fullWidth
            />

            <TextField
              label="Fin del periodo"
              value={new Date(
                suscripcion.currentPeriodEnd,
              ).toLocaleDateString()}
              disabled
              fullWidth
            />
          </Box>
        </>
      )}
    </GenericModal>
  );
};
