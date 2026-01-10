import { TextField, Button} from "@mui/material";
import type {
  ProfileUser,
  ProfileUserUpdateDto,
} from "../../../services/userProfileApi";
import { useState } from "react";
import { AvatarUpload } from "../../../components/AvatarUpload";

interface Props {
  profile: ProfileUser;
  onSave: (data: ProfileUserUpdateDto) => void;
  onUploadPhoto: (file: File) => void;
  loading?: boolean;
}

export const UserProfileForm = ({
  profile,
  onSave,
  onUploadPhoto,
  loading,
}: Props) => {
  const [form, setForm] = useState<ProfileUserUpdateDto>({
    nombre: profile.nombre,
    email: profile.email,
    comercioId: profile.comercioId || 0,
  });

  return (
    <div className="row mt-3">
      <AvatarUpload profile={profile} onUploadPhoto={onUploadPhoto} />

      <div className="col-12 mb-3">
        <TextField
          label="Nombre"
          fullWidth
          size="small"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
      </div>

      <div className="col-12 mb-3">
        <TextField
          label="Correo electrónico"
          fullWidth
          size="small"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
