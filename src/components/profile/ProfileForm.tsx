import { TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import type { Profile, ProfileUpdateDto } from "../../pages/Admin/profile/profile.types";


interface Props {
  profile: Profile;
  onSave: (data: ProfileUpdateDto) => void;
  loading?: boolean;
}

export const ProfileForm = ({ profile, onSave, loading }: Props) => {
  const [form, setForm] = useState<ProfileUpdateDto>({
    nombre: "",
    email: "",
    comercioId: 0,
    password: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      nombre: profile.nombre,
      email: profile.email,
      comercioId: profile.comercioId || 0,
      password: "",
    });
  }, [profile]);

  return (
    <div className="row mt-3">
      <div className="col-12 col-md-12 mb-3">
        <TextField
          label="Nombre"
          fullWidth
          size="small"
          value={form.nombre}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
        />
      </div>

      <div className="col-12 col-md-12 mb-3">
        <TextField
          label="Correo electrónico"
          fullWidth
          size="small"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
      </div>

      <div className="col-12 d-flex justify-content-end">
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          disabled={loading}
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  );
};
