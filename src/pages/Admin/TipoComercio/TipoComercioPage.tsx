import {
  IconButton,
  Button,
  Box,
  Paper,
  Tooltip,
  Stack,
  Typography,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useState } from "react";
import type { TipoComercioCreateDto } from "../../../services/tipoComercioApi";
import { useTiposComercio } from "../../../hooks/useTiposComercio";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import { TipoComercioModal } from "../../../components/TipoComercio/TipoComercioModal";
import { SearchInput } from "../../../components/SearchInput";
import { OrderSelect } from "../../../components/OrderSelect";

export const TiposComercioPage = () => {
  const initialForm: TipoComercioCreateDto = {
    nombre: "",
    descripcion: "",
    activo: true,
  };

  const { tipos, total, loading, listar, guardar, eliminar } =
    useTiposComercio();

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<TipoComercioCreateDto>(initialForm);

  // Listar con paginación
  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search]);

  const columns: TableColumn<TipoComercioCreateDto>[] = [
    {
      key: "nombre",
      label: "Nombre",
      render: (t) => <Typography fontWeight={600}>{t.nombre}</Typography>,
    },
    {
      key: "descripcion",
      label: "Descripción",
      render: (t) => t.descripcion ?? "—",
    },
    {
      key: "activo",
      label: "Activo",
      render: (t) =>
        t.activo ? (
          <Chip label="Sí" color="success" size="small" />
        ) : (
          <Chip label="No" size="small" />
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
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
        >
          <SearchInput
            value={search}
            placeholder="Buscar tipo de comercio…"
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />

          <OrderSelect
            value={orderBy}
            onChange={(value) => {
              setOrderBy(value);
              setPage(1);
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setTipo(initialForm);
              setOpen(true);
            }}
            sx={{
              ml: "auto",
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, #007AFF 0%, #005FCC 100%)",
              boxShadow: "0 6px 16px rgba(0,122,255,0.3)",
              "&:hover": {
                boxShadow: "0 8px 20px rgba(0,122,255,0.4)",
              },
            }}
          >
            Nuevo
          </Button>
        </Stack>
      </Paper>

      {/* Tabla */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <GenericTable<TipoComercioCreateDto>
          columns={columns}
          data={tipos}
          loading={loading}
          emptyText="No hay tipos de comercio registrados"
          page={page - 1}
          rowsPerPage={rows}
          total={total}
          onPageChange={(p) => setPage(p + 1)}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(1);
          }}
          actions={(t) => (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => {
                    setTipo(t);
                    setOpen(true);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Eliminar">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    eliminar(Number(t.id), { page, rows, orderBy, search })
                  }
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        />
      </Paper>

      {open && (
        <TipoComercioModal
          key={`edit-${tipo?.id ?? "new"}`}
          open={open}
          onClose={() => {
            setOpen(false);
            setTipo(initialForm);
          }}
          onSave={(t) => guardar(t, { page, rows, orderBy, search })}
          tipo={tipo}
          loading={loading}
        />
      )}
    </Box>
  );
};
