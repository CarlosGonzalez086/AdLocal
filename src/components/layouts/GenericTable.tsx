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
  Box,
  Fade,
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

  // 👉 SOLO 2 columnas en móvil (las primeras 2)
  const visibleColumns = isMobile ? columns.slice(0, 2) : columns;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const totalColumns = visibleColumns.length + (actions ? 1 : 0);

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      <Table>
        {/* HEADER */}
        <TableHead>
          <TableRow
            sx={{
              background:
                "linear-gradient(180deg, rgba(248,249,250,1), rgba(240,242,244,1))",
            }}
          >
            {visibleColumns.map((col) => (
              <TableCell
                key={String(col.key)}
                align={col.align ?? "left"}
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {col.label}
              </TableCell>
            ))}

            {actions && (
              <TableCell
                align="right"
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: "text.secondary",
                }}
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
              <TableCell colSpan={totalColumns}>
                <Box py={2}>
                  <LinearProgress />
                  <Typography
                    mt={1.5}
                    fontSize={13}
                    color="text.secondary"
                    textAlign="center"
                  >
                    Cargando información…
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={totalColumns}>
                <Box py={4} textAlign="center">
                  <Typography fontWeight={600}>{emptyText}</Typography>
                  <Typography fontSize={13} color="text.secondary">
                    Intenta ajustar los filtros
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <Fade in key={index}>
                <TableRow
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.03)",
                    },
                  }}
                >
                  {visibleColumns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      align={col.align ?? "left"}
                      sx={{ fontSize: 14 }}
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </TableCell>
                  ))}

                  {actions && (
                    <TableCell align="right">
                      {isMobile ? (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, row)}
                          sx={{
                            bgcolor: "rgba(0,0,0,0.04)",
                            borderRadius: "10px",
                            "&:hover": {
                              bgcolor: "rgba(0,0,0,0.08)",
                            },
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          {actions(row)}
                        </Box>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              </Fade>
            ))
          )}
        </TableBody>

        {/* FOOTER */}
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 30, 100]}
              count={total}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, p) => onPageChange(p)}
              onRowsPerPageChange={(e) =>
                onRowsPerPageChange(Number(e.target.value))
              }
              labelRowsPerPage="Filas"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
              SelectProps={{ native: true }}
              sx={{
                borderTop: "1px solid rgba(0,0,0,0.08)",
                ".MuiTablePagination-toolbar": {
                  minHeight: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  px: 2,
                },
                ".MuiTablePagination-displayedRows": {
                  fontSize: 13,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                },
                ".MuiTablePagination-selectLabel": {
                  fontSize: 13,
                  mt: 1,
                },
                ".MuiTablePagination-select": {
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                },
                ".MuiTablePagination-actions": {
                  display: "flex",
                  alignItems: "center",
                  ml: 1,
                },
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>

      {/* MENÚ DE ACCIONES EN MÓVIL */}
      {isMobile && actions && (
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              minWidth: 180,
              overflow: "hidden",

              // iOS glass style
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,.92), rgba(245,245,247,.96))",

              border: "1px solid rgba(0,0,0,.08)",
              boxShadow:
                "0 20px 40px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.6)",
            },
          }}
        >
          {selectedRow && (
            <Box px={1} py={0.5}>
              {actions(selectedRow)}
            </Box>
          )}
        </Menu>
      )}
    </TableContainer>
  );
}
