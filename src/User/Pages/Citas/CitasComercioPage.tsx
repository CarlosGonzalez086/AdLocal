import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "../../../utils/sweetalert";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import { StatusBadge, type StatusVariant } from "../../../components/UI/StatusBadge";
import { AppDatePicker } from "../../../components/UI/DateTimePickers";
import { pedidosComercioApi } from "../../../services/pedidosComercioApi";
import { citasComercioApi } from "../../../services/citasComercioApi";
import {
  type CitaDto,
  type EstadoCita as EstadoCitaType,
} from "../../../types/User/citas";
import type { ComercioPedidoSelectorDto } from "../../../types/User/pedidosComercio";
import { CitaDetalleModal } from "./Components/CitaDetalleModal";

const textos: Record<number, string> = {
  1: "Pendiente",
  2: "Confirmada",
  3: "En atención",
  4: "Completada",
  5: "Cancelada",
  6: "No asistió",
};

const getEstadoCitaVariant = (estado: number): StatusVariant => {
  switch (estado) {
    case 1:
      return "warning";
    case 2:
      return "info";
    case 3:
      return "purple";
    case 4:
      return "success";
    case 5:
      return "error";
    default:
      return "neutral";
  }
};
export function CitasComercioPage() {
  const [comercios, setComercios] = useState<ComercioPedidoSelectorDto[]>([]),
    [comercioId, setComercioId] = useState(0),
    [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)),
    [citas, setCitas] = useState<CitaDto[]>([]),
    [loading, setLoading] = useState(true),
    [seleccionada, setSeleccionada] = useState<CitaDto | null>(null),
    [error, setError] = useState("");
  const [page, setPage] = useState(0),
    [rows, setRows] = useState(10);
  useEffect(() => {
    pedidosComercioApi
      .comercios()
      .then((r) => {
        const cs = r.data.respuesta ?? [];
        setComercios(cs);
        setComercioId(cs[0]?.id ?? 0);
      })
      .catch(() => setError("No fue posible cargar los comercios."));
  }, []);
  useEffect(() => {
    if (!comercioId) return;
    setLoading(true);
    citasComercioApi
      .agenda(comercioId, fecha)
      .then((r) => setCitas(r.data.respuesta ?? []))
      .catch(() => setError("No fue posible cargar la agenda."))
      .finally(() => setLoading(false));
  }, [comercioId, fecha]);
  const columns = useMemo<TableColumn<CitaDto>[]>(
    () => [
      {
        key: "fechaInicio",
        label: "Hora",
        render: (c) =>
          new Date(c.fechaInicio).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
      { key: "nombrePersona", label: "Persona a atender" },
      { key: "servicio", label: "Servicio" },
      { key: "cliente", label: "Reservó" },
      { key: "nombreAtiende", label: "Atiende" },
      {
        key: "estado",
        label: "Estado",
        render: (c) => (
          <StatusBadge
            label={textos[c.estado] || "Desconocido"}
            variant={getEstadoCitaVariant(c.estado)}
            dot
            size="small"
          />
        ),
      },
    ],
    [],
  );
  const guardar = async (
    estado: EstadoCitaType,
    nombreAtiende: string,
    motivo: string,
  ) => {
    if (!seleccionada) {
      return {
        noClose: true,
      };
    }

    setLoading(true);

    try {
      const r = await citasComercioApi.actualizar(
        comercioId,
        seleccionada.uuid,
        {
          estado,
          nombreAtiende,
          motivo,
        },
      );

      setCitas((v) =>
        v.map((c) => (c.uuid === seleccionada.uuid ? r.data.respuesta : c)),
      );

      await Swal.fire("Actualizada", "La cita fue actualizada.", "success");

      return {
        success: true,
      };
    } catch {
      setError("No fue posible actualizar la cita.");

      return {
        noClose: true,
      };
    } finally {
      setLoading(false);
    }
  };
  const visibles = citas.slice(page * rows, page * rows + rows);
  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="fz-h1 fw-bold mb-1">Agenda de citas</h1>
          <p className="fz-h4 mb-0">
            Consulta en orden quién sigue y asigna a la persona que atenderá.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <FormControl size="small">
            <InputLabel>Comercio</InputLabel>
            <Select
              label="Comercio"
              value={comercioId || ""}
              onChange={(e) => setComercioId(Number(e.target.value))}
            >
              {comercios.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ minWidth: "175px" }}>
            <AppDatePicker
              label="Filtrar por día"
              value={fecha}
              size="small"
              onChange={(newDate) => {
                setFecha(newDate || "");
                setPage(0);
              }}
            />
          </div>
        </div>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
      <div className="appointment-table-card">
        <GenericTable
          columns={columns}
          data={visibles}
          loading={loading}
          page={page}
          rowsPerPage={rows}
          total={citas.length}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(0);
          }}
          getRowKey={(c) => c.uuid}
          actions={(c) => (
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSeleccionada(c)}
              sx={{
                minHeight: "36px",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "13px",
                py: 0.5,
                px: 1.5,
                color: "#008989",
                borderColor: "rgba(0, 137, 137, 0.25)",
                backgroundColor: "rgba(0, 137, 137, 0.05)",
                "&:hover": {
                  borderColor: "#008989",
                  backgroundColor: "rgba(0, 137, 137, 0.12)",
                },
              }}
            >
              Gestionar
            </Button>
          )}
        />
      </div>
      <CitaDetalleModal
        cita={seleccionada}
        loading={loading}
        onClose={() => setSeleccionada(null)}
        onSave={(estado, atiende, motivo) => guardar(estado, atiende, motivo)}
      />
    </div>
  );
}
