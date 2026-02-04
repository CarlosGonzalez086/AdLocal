import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Chip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { SuscripcionDto, UsuarioDto } from "../services/usersApi";


interface Props {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioDto;
  suscripcion?: SuscripcionDto;
  soloVer?: boolean;
}

const iosColors = {
  primary: "#007AFF",
  background: "#F9FAFB",
};

/* ============================
   Helpers
============================ */
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

/* ============================
   Component
============================ */
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
    [usuario]
  );

  const [form, setForm] = useState<UsuarioDto>(initialForm);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialForm);
    }
  }, [initialForm, open]);

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
      {/* ===== TITLE ===== */}
      <DialogTitle sx={{ fontWeight: 600 }}>
        {soloVer ? "Información del usuario" : "Editar usuario"}
      </DialogTitle>

      {/* ===== CONTENT ===== */}
      <DialogContent>
        {/* ===== AVATAR ===== */}
        <Stack alignItems="center" spacing={2} mb={3}>
          <Avatar
            src={form.fotoUrl ?? undefined}
            sx={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              bgcolor: "#e8692c",
              fontSize: 36,
              fontWeight: 600,
            }}
          >
            {!form.fotoUrl && form.nombre?.charAt(0).toUpperCase()}
          </Avatar>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* ===== USUARIO ===== */}
        <Stack spacing={2}>
          <TextField
            label="Nombre"
            value={form.nombre}
            disabled
            fullWidth
          />

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
        </Stack>

        {/* ===== SUSCRIPCIÓN ===== */}
        {suscripcion && (
          <>
            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              {/* Plan */}
              <TextField
                label="Plan"
                value={suscripcion.plan.nombre}
                disabled
                fullWidth
              />

              {/* Estado */}
              <Stack spacing={0.5}>
                <Typography
                  fontSize={13}
                  color="text.secondary"
                >
                  Estado de la suscripción
                </Typography>
                <Chip
                  size="small"
                  label={getStatusLabel(suscripcion.status)}
                  color={getStatusColor(suscripcion.status)}
                  sx={{ alignSelf: "flex-start" }}
                />
              </Stack>

              {/* Renovación */}
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

              {/* Periodo */}
              <TextField
                label="Inicio del periodo"
                value={new Date(
                  suscripcion.currentPeriodStart
                ).toLocaleDateString()}
                disabled
                fullWidth
              />

              <TextField
                label="Fin del periodo"
                value={new Date(
                  suscripcion.currentPeriodEnd
                ).toLocaleDateString()}
                disabled
                fullWidth
              />
            </Stack>
          </>
        )}
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
