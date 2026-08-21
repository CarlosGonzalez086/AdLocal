import { Button, CircularProgress, TextField } from "@mui/material";

import { useEffect, useState } from "react";

import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

import type {
  Profile,
  ProfileUpdateDto,
} from "../../../../types/Admin/profile.types";

interface Props {
  profile: Profile;

  onSave: (data: ProfileUpdateDto) => void;

  loading?: boolean;
}

export const ProfileForm = ({ profile, onSave, loading = false }: Props) => {
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
    <div className="profileForm">
      <div className="row g-3">
        <div className="col-12">
          <TextField
            label="Nombre"
            fullWidth
            value={form.nombre}
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
            label="Correo electrónico"
            type="email"
            fullWidth
            value={form.email}
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
