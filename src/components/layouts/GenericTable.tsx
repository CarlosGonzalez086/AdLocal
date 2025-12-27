import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Paper,
  LinearProgress,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
}

interface GenericTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  actions?: (row: T) => ReactNode;
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export function GenericTable<T>({
  columns,
  data,
  loading = false,
  emptyText = "No hay registros",
  actions,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}: GenericTableProps<T>) {
  return (
    <TableContainer component={Paper}>
      <Table className="tabla-davincix">
        {/* HEADER */}
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f7ebd1" }}>
            {columns.map((col) => (
              <TableCell
                key={String(col.key)}
                align={col.align ?? "left"}
                sx={{ color: "#008c82", fontWeight: "bold" }}
              >
                {col.label}
              </TableCell>
            ))}
            {actions && (
              <TableCell
                align="right"
                sx={{ color: "#008c82", fontWeight: "bold" }}
              >
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        {/* BODY */}
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                <LinearProgress />
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  Cargando información...
                </Typography>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                align="center"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    align={col.align ?? "left"}
                  >
                    {col.render
                      ? col.render(row)
                      : (row as any)[col.key]}
                  </TableCell>
                ))}

                {actions && (
                  <TableCell align="right">
                    {actions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>

        {/* FOOTER */}
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[15, 30, 100, { label: "Todos", value: -1 }]}
              count={total}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, p) => onPageChange(p)}
              onRowsPerPageChange={(e) =>
                onRowsPerPageChange(+e.target.value)
              }
              labelRowsPerPage="Registros por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from} - ${to} de ${count}`
              }
              SelectProps={{
                native: true,
                inputProps: { "aria-label": "Filas por página" },
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
