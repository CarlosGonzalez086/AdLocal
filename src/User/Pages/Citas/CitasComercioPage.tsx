import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "../../../utils/sweetalert";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import {
  StatusBadge,
  type StatusVariant,
} from "../../../components/UI/StatusBadge";
import { AppDatePicker } from "../../../components/UI/DateTimePickers";
import { pedidosComercioApi } from "../../../services/pedidosComercioApi";
import { citasComercioApi } from "../../../services/citasComercioApi";
import {
  type CitaDto,
  type EstadoCita as EstadoCitaType,
} from "../../../types/User/citas";
import type { ComercioPedidoSelectorDto } from "../../../types/User/pedidosComercio";
import { CitaDetalleModal } from "./Components/CitaDetalleModal";
import { diaAgenda, horaCita } from "../../../utils/citaFecha";
import { extraerMensajeError } from "../../../utils/errorHandler";

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
    [fecha, setFecha] = useState(diaAgenda()),
    [citas, setCitas] = useState<CitaDto[]>([]),
    [loading, setLoading] = useState(true),
    [seleccionada, setSeleccionada] = useState<CitaDto | null>(null),
    [error, setError] = useState("");
  const [page, setPage] = useState(0),
    [rows, setRows] = useState(10);
  const operando = useRef(false);
  useEffect(() => {
    pedidosComercioApi
      .comercios()
      .then((r) => {
        const cs = r.data.respuesta ?? [];
        setComercios(cs);
        setComercioId(cs[0]?.id ?? 0);
        setFecha(diaAgenda(new Date(), cs[0]?.zonaHoraria));
      })
      .catch(() => setError("No fue posible cargar los comercios."));
  }, []);
  useEffect(() => {
    let vigente = true;
    if (!comercioId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    setCitas([]);
    setSeleccionada(null);
    setPage(0);
    citasComercioApi
      .agenda(comercioId, fecha)
      .then((r) => {
        if (vigente) {
          if (r.data.codigo !== "200") throw new Error(r.data.mensaje);
          setCitas(r.data.respuesta ?? []);
        }
      })
      .catch(() => {
        if (vigente) setError("No fue posible cargar la agenda.");
      })
      .finally(() => {
        if (vigente) setLoading(false);
      });
    return () => {
      vigente = false;
    };
  }, [comercioId, fecha]);
  const columns = useMemo<TableColumn<CitaDto>[]>(
    () => [
      {
        key: "fechaInicio",
        label: "Hora",
        render: (c) => horaCita(c.fechaInicio),
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
    if (!seleccionada || operando.current) {
      return {
        noClose: true,
      };
    }

    operando.current = true;
    setLoading(true);
    setError("");

    try {
      const r = await citasComercioApi.actualizar(
        comercioId,
        seleccionada.uuid,
        {
          versionCita: seleccionada.version,
          estado,
          nombreAtiende,
          motivo,
        },
      );
      if (r.data.codigo !== "200" || !r.data.respuesta?.uuid)
        throw new Error(r.data.mensaje || "Respuesta incompleta.");

      setCitas((v) =>
        v.map((c) => (c.uuid === seleccionada.uuid ? r.data.respuesta : c)),
      );

      await Swal.fire("Actualizada", "La cita fue actualizada.", "success");

      return {
        success: true,
      };
    } catch (e) {
      setError(
        extraerMensajeError(
          e,
          "No se confirmó el cambio. Cierra el detalle y comprueba la agenda antes de reintentar.",
        ),
      );
      try {
        const actual = await citasComercioApi.agenda(comercioId, fecha);
        if (actual.data.codigo === "200") setCitas(actual.data.respuesta ?? []);
      } catch {
        /* Preserve the visible error and current form. */
      }

      return {
        noClose: true,
      };
    } finally {
      operando.current = false;
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
            Consulta quién sigue y asigna la atención. Zona:{" "}
            {comercios.find((c) => c.id === comercioId)?.zonaHoraria ||
              "Sin cargar"}
            .
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <FormControl size="small">
            <InputLabel>Comercio</InputLabel>
            <Select
              disabled={loading}
              label="Comercio"
              value={comercioId || ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setComercioId(id);
                setFecha(
                  diaAgenda(
                    new Date(),
                    comercios.find((c) => c.id === id)?.zonaHoraria,
                  ),
                );
              }}
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
              disabled={loading}
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
        error={error}
        onClose={() => setSeleccionada(null)}
        onSave={(estado, atiende, motivo) => guardar(estado, atiende, motivo)}
      />
    </div>
  );
}
