import { Avatar, IconButton, Paper, Stack, Typography } from "@mui/material";
import type { ComercioDtoListItem } from "../../services/comercioApi";
import { GenericTable, type TableColumn } from "../layouts/GenericTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import type { ListarParamsComercio } from "../../hooks/useComercio";

interface Props {
  data: ComercioDtoListItem[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (r: number) => void;
  eliminarFromTable: (
    id: number,
    refrescarParams: ListarParamsComercio,
  ) => void;
}

export function ComerciosTable(props: Props) {
  const columns: TableColumn<ComercioDtoListItem>[] = [
    {
      key: "Nombre",
      label: "Nombre",
      render: (p) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={p.logoUrl} sx={{ width: 32, height: 32 }} />
          <Typography fontWeight={600}>{p.nombre}</Typography>
        </Stack>
      ),
    },
    {
      key: "telefono",
      label: "Telefono",
    },
    {
      key: "email",
      label: "Correo",
    },
    {
      key: "direccion",
      label: "Direccion",
    },
  ];
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <GenericTable<ComercioDtoListItem>
        {...props}
        columns={columns}
        actions={(p) => (
          <Stack direction="row" spacing={0.5}>
            <Link
              to={`editar/${p.id}`}
              className="d-block"
              style={{ textDecoration: "none" }}
            >
              <IconButton size="small">
                <EditIcon />
              </IconButton>
            </Link>

            <IconButton
              size="small"
              color="error"
              onClick={() =>
                props.eliminarFromTable(p.id, {
                  page: props.page,
                  rowsPerPage: props.rowsPerPage,
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        )}
      />
    </Paper>
  );
}
