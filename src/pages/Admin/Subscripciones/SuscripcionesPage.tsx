import { Box, Paper, Typography, Stack, Chip } from "@mui/material";
import { useEffect, useState } from "react";

import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import { utcToLocal } from "../../../utils/generalsFunctions";
import { useSuscripcionesAdmin } from "../../../hooks/useSuscripcionesAdmin";
import type { SuscripcionListadoDto } from "../../../services/suscripciones.api";

const getEstadoChip = (estado: string) => {
  switch (estado) {
    case "active":
      return { label: "Activa", color: "success" as const };
    case "canceling":
      return { label: "Por cancelar", color: "warning" as const };
    case "canceled":
      return { label: "Cancelada", color: "default" as const };
    case "past_due":
    case "unpaid":
      return { label: "Por pagar", color: "error" as const };
    default:
      return { label: estado, color: "default" as const };
  }
};

export const SuscripcionesPage = () => {
  const { total, loading, listar, suscripciones } = useSuscripcionesAdmin();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    listar({ page, rows });
  }, [page, rows, listar]);

  /* ============================
     Columns
  ============================ */
  const columns: TableColumn<SuscripcionListadoDto>[] = [
    {
      key: "usuario",
      label: "Usuario",
      render: (row) => (
        <Stack>
          <Typography fontWeight={600}>{row.usuarioNombre}</Typography>
          <Typography fontSize={13} color="text.secondary">
            {row.usuarioEmail}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (row) => (
        <Typography fontWeight={500}>{row.planNombre}</Typography>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => {
        const chip = getEstadoChip(row.estado);
        return <Chip size="small" label={chip.label} color={chip.color} />;
      },
    },
    {
      key: "inicio",
      label: "Inicio",
      render: (row) =>
        row.fechaInicio ? (
          <Typography fontSize={13}>{utcToLocal(row.fechaInicio)}</Typography>
        ) : (
          "-"
        ),
    },
    {
      key: "fin",
      label: "Fin",
      render: (row) =>
        row.fechaFin ? (
          <Typography fontSize={13}>{utcToLocal(row.fechaFin)}</Typography>
        ) : (
          "-"
        ),
    },
    {
      key: "autoRenew",
      label: "Renovación",
      render: (row) => (
        <Typography fontSize={13}>
          {row.autoRenew ? "Automática" : "Manual"}
        </Typography>
      ),
    },
    {
      key: "precio",
      label: "Precio",
      render: (row) => (
        <Typography fontWeight={500}>${row.precio} MXN</Typography>
      ),
    },
  ];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
        }}
      >
        <Typography fontWeight={600} fontSize={18}>
          Suscripciones
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Listado de todas las suscripciones del sistema
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <GenericTable<SuscripcionListadoDto>
          columns={columns}
          data={suscripciones}
          loading={loading}
          emptyText="No hay suscripciones registradas"
          page={page}
          rowsPerPage={rows}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};
