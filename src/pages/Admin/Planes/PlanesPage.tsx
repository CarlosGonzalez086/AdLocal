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
import type { PlanCreateDto } from "../../../services/planApi";
import { usePlanes } from "../../../hooks/usePlanes";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import { SearchInput } from "../../../components/SearchInput";
import { OrderSelect } from "../../../components/OrderSelect";
import { PlanModal } from "../../../components/Plan/PlanModal";

export const PlanesPage = () => {
  const initialForm: PlanCreateDto = {
    nombre: "",
    precio: 0,
    duracionDias: 30,
    tipo: "FREE",

    maxNegocios: 1,
    maxProductos: 0,
    maxFotos: 1,
    stripePriceId: "",
    nivelVisibilidad: 0,
    permiteCatalogo: false,
    coloresPersonalizados: false,
    tieneBadge: false,
    badgeTexto: null,
    tieneAnalytics: false,
    isMultiUsuario: false,
  };

  const { planes, total, loading, listar, guardar, eliminar } = usePlanes();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PlanCreateDto>(initialForm);

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search]);

  const columns: TableColumn<PlanCreateDto>[] = [
    {
      key: "nombre",
      label: "Plan",
      render: (p) => (
        <Stack>
          <Typography fontWeight={600}>{p.nombre}</Typography>
          <Typography variant="caption" color="text.secondary">
            {p.tipo}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "precio",
      label: "Precio",
      render: (p) =>
        p.precio === 0 ? (
          <Chip label="Gratis" size="small" color="success" />
        ) : (
          <Typography fontWeight={500}>${p.precio.toLocaleString()}</Typography>
        ),
    },
    {
      key: "duracionDias",
      label: "Duración",
      render: (p) => `${p.duracionDias} días`,
    },
    {
      key: "nivelVisibilidad",
      label: "Visibilidad",
      render: (p) => (
        <Chip
          label={`${p.nivelVisibilidad}%`}
          size="small"
          color={
            p.nivelVisibilidad >= 70
              ? "success"
              : p.nivelVisibilidad >= 30
                ? "warning"
                : "default"
          }
        />
      ),
    },
    {
      key: "maxNegocios",
      label: "Negocios",
    },
    {
      key: "maxProductos",
      label: "Productos",
    },
    {
      key: "tieneBadge",
      label: "Badge",
      render: (p) =>
        p.tieneBadge ? (
          <Chip label={p.badgeTexto ?? "Badge"} size="small" color="primary" />
        ) : (
          "—"
        ),
    },
    {
      key: "isMultiUsuario",
      label: "MultriUsuario",
      render: (p) =>
        p.isMultiUsuario ? (
          <Chip label={"Si"} size="small" color="primary" />
        ) : (
          "—"
        ),
    },
  ];

  return (
    <Box>
      {/* Header filtros */}
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
            placeholder="Buscar plan…"
            onChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
          />

          <OrderSelect
            value={orderBy}
            onChange={(value) => {
              setOrderBy(value);
              setPage(0);
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setPlan(initialForm);
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
        <GenericTable<PlanCreateDto>
          columns={columns}
          data={planes}
          loading={loading}
          emptyText="No hay planes registrados"
          page={page}
          rowsPerPage={rows}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(0);
          }}
          actions={(p) => (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => {
                    setPlan(p);
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
                    eliminar(Number(p.id), {
                      page,
                      rows,
                      orderBy,
                      search,
                    })
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
        <>
          {" "}
          <PlanModal
            key={`edit-${plan?.id ?? "new"}`}
            open={open}
            onClose={() => {
              setOpen(false);
              setPlan(initialForm);
            }}
            onSave={(p) => guardar(p, { page, rows, orderBy, search })}
            plan={plan}
            loading={loading}
          />
        </>
      )}
    </Box>
  );
};
