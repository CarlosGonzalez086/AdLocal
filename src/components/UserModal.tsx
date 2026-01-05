import {
  Dialog,
  DialogActions,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { UserDto } from "../services/usersApi";

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: UserDto;
  soloVer?: boolean;
}

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="w-100 p-3">
        <h4> {soloVer ? "Informacion del usuario" : ""}</h4>
        <div className="d-flex justify-content-center mb-3">
          <Avatar
            src={form.fotoUrl}
            sx={{ width: 120, height: 120 }}
            variant="circular"
          />
        </div>
        <div className="w-100 row gap-3 mt-4">
          {[
            { id: 1, text: "Nombre", field: "nombre" },
            { id: 2, text: "Correo", field: "email" },
          ].map((item) => (
            <div className="col-12 w-100" key={item.id}>
              <TextField
                label={item.text}
                fullWidth
                size="small"
                value={form[item.field as keyof UserDto]}
                disabled={soloVer}
              />
            </div>
          ))}
        </div>
      </div>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
