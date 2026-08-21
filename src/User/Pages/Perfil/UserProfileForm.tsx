import { Button, CircularProgress, TextField } from "@mui/material";

import { useState } from "react";

import { AvatarUpload } from "../../../components/AvatarUpload";

import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import type {
  ProfileUser,
  ProfileUserUpdateDto,
} from "../../../types/User/UserAuth";

interface Props {
  profile: ProfileUser;

  onSave: (data: ProfileUserUpdateDto) => void;

  onUploadPhoto: (file: File) => void;

  loading?: boolean;

  onFocus?: () => void;
}

export const UserProfileForm = ({
  profile,
  onSave,
  onUploadPhoto,
  loading = false,
  onFocus,
}: Props) => {
  const [form, setForm] = useState<ProfileUserUpdateDto>({
    nombre: profile.nombre,

    email: profile.email,

    comercioId: profile.comercioId || 0,
  });

  return (
    <div className="profileForm">
      <div className="d-flex justify-content-center mb-4">
        <AvatarUpload profile={profile} onUploadPhoto={onUploadPhoto} />
      </div>

      <div className="row g-3">
        <div className="col-12">
          <TextField
            label="Nombre"
            fullWidth
            value={form.nombre}
            onFocus={onFocus}
            onChange={(event) =>
              setForm((previousForm) => ({
                ...previousForm,

                nombre: event.target.value,
              }))
            }
            className="adlocalTextField"
          />
        </div>

        <div className="col-12">
          <TextField
            type="email"
            label="Correo electrónico"
            fullWidth
            value={form.email}
            onFocus={onFocus}
            onChange={(event) =>
              setForm((previousForm) => ({
                ...previousForm,

                email: event.target.value,
              }))
            }
            className="adlocalTextField"
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <Button
          type="button"
          variant="contained"
          disabled={loading}
          className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
          onClick={() => onSave(form)}
          startIcon={
            loading ? (
              <CircularProgress
                size={16}
                thickness={4}
                className="profileButtonProgress"
              />
            ) : (
              <MaterialSymbol icon="save" size="small" />
            )
          }
        >
          {loading ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
};
