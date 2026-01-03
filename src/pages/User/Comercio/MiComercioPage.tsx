import { Button, Card, CardContent, LinearProgress } from "@mui/material";
import { useState } from "react";
import { useComercio } from "../../../hooks/useComercio";
import { ComercioForm } from "./ComercioForm";

export const MiComercioPage = () => {
  const { comercio, loading, guardar, eliminar } = useComercio();

  const [editando, setEditando] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <p className="mb-2 text-muted">
            Cargando información del comercio...
          </p>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  if (!comercio) {
    return (
      <Card>
        <CardContent>
          <h3>Registrar comercio</h3>
          <ComercioForm
            initialData={{
              nombre: "",
              direccion: "",
              telefono: "",
            }}
            loading={loading}
            onSave={guardar}
          />
        </CardContent>
      </Card>
    );
  }

  if (editando) {
    return (
      <Card>
        <CardContent>
          <h3>Editar comercio</h3>

          <ComercioForm
            initialData={comercio}
            loading={loading}
            onSave={async (data) => {
              await guardar(data);
              setEditando(false);
            }}
          />

          <div className="mt-3">
            <Button variant="outlined" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <h3>Mi comercio</h3>

        <p>
          <b>Nombre:</b> {comercio.nombre}
        </p>
        <p>
          <b>Dirección:</b> {comercio.direccion}
        </p>
        <p>
          <b>Teléfono:</b> {comercio.telefono}
        </p>

        <div className="d-flex gap-2 mt-3">
          <Button variant="contained" onClick={() => setEditando(true)}>
            Editar
          </Button>

          <Button variant="outlined" color="error" onClick={eliminar}>
            Eliminar comercio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
