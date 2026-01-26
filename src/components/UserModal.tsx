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
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { UserDto } from "../services/usersApi";

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: UserDto;
  soloVer?: boolean;
}

const iosColors = {
  primary: "#007AFF",
  background: "#F9FAFB",
};

export const UserModal = ({ open, onClose, usuario, soloVer }: Props) => {
  const initialForm = useMemo(
    () => ({
      nombre: usuario.nombre ?? "",
      email: usuario.email ?? "",
      fotoUrl: usuario.fotoUrl ?? "",
      id: usuario.id,
      fechaCreacion: usuario.fechaCreacion ?? "",
    }),
    [usuario]
  );

  const [form, setForm] = useState<UserDto>(initialForm);

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
      <DialogTitle sx={{ fontWeight: 600 }}>
        {soloVer ? "Información del usuario" : "Editar usuario"}
      </DialogTitle>

      <DialogContent>
        {/* ===== AVATAR ===== */}
        <Stack alignItems="center" spacing={2} mb={3}>
          <Avatar
            src={form.fotoUrl || undefined}
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

        {/* ===== FORM ===== */}
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
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
