import { TextField, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import type { ComercioDto } from "../../../services/comercioApi";

interface Props {
  initialData: ComercioDto;
  loading?: boolean;
  onSave: (data: ComercioDto) => void;
  soloVer?: boolean;
}

export const ComercioForm = ({
  initialData,
  loading = false,
  onSave,
  soloVer = false,
}: Props) => {
  const [form, setForm] = useState<ComercioDto>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange =
    (field: keyof ComercioDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <TextField
            label="Nombre del comercio"
            value={form.nombre}
            onChange={handleChange("nombre")}
            fullWidth
            required
            disabled={soloVer}
          />
        </div>

        <div className="col-12">
          <TextField
            label="Dirección"
            value={form.direccion}
            onChange={handleChange("direccion")}
            fullWidth
            required
            disabled={soloVer}
          />
        </div>

        <div className="col-12 col-md-6">
          <TextField
            label="Teléfono"
            value={form.telefono}
            onChange={handleChange("telefono")}
            fullWidth
            required
            disabled={soloVer}
          />
        </div>

        {!soloVer && (
          <div className="col-12 d-flex justify-content-end">
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};
