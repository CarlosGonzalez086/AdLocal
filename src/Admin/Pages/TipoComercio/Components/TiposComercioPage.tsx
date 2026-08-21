import { Button, Box, Paper, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useState } from "react";
import type { TipoComercioCreateDto } from "../../../../types/Admin/tipoComercio";
import { useTiposComercio } from "../../../../hooks/useTiposComercio";
import { SearchInput } from "../../../../components/SearchInput";
import { OrderSelect } from "../../../../components/OrderSelect";
import { TiposComercioTable } from "./TiposComercioTable";
import { TipoComercioModal } from "./TipoComercioModal";

export const TiposComercioPageAdmin = () => {
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

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search]);

  return (
    <Box>
      <Paper elevation={0} className="filters-paper">
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
            className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
            onClick={() => {
              setTipo(initialForm);
              setOpen(true);
            }}
          >
            Nuevo
          </Button>
        </Stack>
      </Paper>
      <div className="mt-4">
        <TiposComercioTable
          tipos={tipos}
          total={total}
          loading={loading}
          page={page - 1}
          rows={rows}
          onPageChange={(p) => setPage(p + 1)}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(1);
          }}
          onEdit={(t) => {
            setTipo(t);
            setOpen(true);
          }}
          onDelete={(t) =>
            eliminar(Number(t.id), { page, rows, orderBy, search })
          }
        />
      </div>
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
