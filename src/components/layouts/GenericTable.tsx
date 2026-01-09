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
  IconButton,
  Menu,
  useMediaQuery,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";
import { useState, type ReactNode } from "react";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const visibleColumns = isMobile ? columns.slice(0, 2) : columns;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f7ebd1" }}>
            {visibleColumns.map((col) => (
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

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + 1}>
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
              <TableCell colSpan={visibleColumns.length + 1} align="center">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index} hover>
                {visibleColumns.map((col) => (
                  <TableCell key={String(col.key)} align={col.align ?? "left"}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </TableCell>
                ))}

                {actions && (
                  <TableCell align="right">
                    {isMobile ? (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, row)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        {actions(row)}
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 30, 100]}
              count={total}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, p) => onPageChange(p)}
              onRowsPerPageChange={(e) => onRowsPerPageChange(+e.target.value)}
              labelRowsPerPage="Registros por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from} - ${to} de ${count}`
              }
              SelectProps={{
                native: true,
              }}
              sx={{
                borderTop: "1px solid #e0e0e0",
                marginTop: 1,
                ".MuiTablePagination-toolbar": {
                  paddingLeft: 2,
                  paddingRight: 2,
                  minHeight: 48,
                },
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    marginBottom: 0,
                    fontSize: "0.875rem",
                  },
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>

      {isMobile && actions && (
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          {selectedRow && actions(selectedRow)}
        </Menu>
      )}
    </TableContainer>
  );
}
