import { Switch, FormControlLabel, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import type { TipoComercioCreateDto } from "../../../../types/Admin/tipoComercio";
import { GenericModal } from "../../../../components/GenericModal";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: TipoComercioCreateDto) => Promise<void>;
  tipo: TipoComercioCreateDto;
  soloVer?: boolean;
  loading?: boolean;
}

const defaultForm: TipoComercioCreateDto = {
  nombre: "",
  descripcion: "",
  activo: true,
};

export const TipoComercioModal = ({
  open,
  onClose,
  onSave,
  tipo,
  soloVer,
  loading = false,
}: Props) => {
  const [form, setForm] = useState<TipoComercioCreateDto>(defaultForm);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ ...defaultForm, ...tipo });
  }, [tipo, open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (soloVer || loading) return;

    await onSave(form);
    onClose();
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      icon={form.id ? "edit_note" : "add_business"}
      title={form.id ? "Editar tipo de comercio" : "Nuevo tipo de comercio"}
      subtitle="Clasifica los negocios que se registran en la plataforma."
      maxWidth="sm"
      loading={loading}
      secondaryLabel={soloVer ? "Cerrar" : "Cancelar"}
      primaryAction={
        soloVer
          ? undefined
          : {
              type: "submit",
              label: "Guardar",
              loadingLabel: "Guardando...",
              icon: "save",
            }
      }
    >
      <Box className="card-adlocal mt-3">
        <div className="row p-3">
          <div className="col-12 mb-3">
            <TextField
              label="Nombre"
              value={form.nombre}
              disabled={soloVer}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              fullWidth
            />
          </div>
          <div className="col-12 mb-3">
            <TextField
              label="Descripción"
              value={form.descripcion ?? ""}
              disabled={soloVer}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              fullWidth
            />
          </div>
          <div className="col-12">
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  disabled={soloVer}
                  onChange={(e) =>
                    setForm({ ...form, activo: e.target.checked })
                  }
                />
              }
              label="Activo"
            />
          </div>
        </div>
      </Box>
    </GenericModal>
  );
};
