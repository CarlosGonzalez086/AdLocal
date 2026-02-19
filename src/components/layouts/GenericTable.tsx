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
  Typography,
  IconButton,
  Menu,
  Box,
  Fade,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
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
  const totalColumns = visibleColumns.length + (actions ? 1 : 0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
      }}
    >
      <Table>
        {/* HEADER */}
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "rgba(0,0,0,0.025)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {visibleColumns.map((col) => (
              <TableCell
                key={String(col.key)}
                align={col.align ?? "left"}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: "text.disabled",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  py: 1.8,
                  borderBottom: "none",
                }}
              >
                {col.label}
              </TableCell>
            ))}

            {actions && (
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: "text.disabled",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  borderBottom: "none",
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
            // Skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: totalColumns }).map((_, j) => (
                  <TableCell key={j} sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <Skeleton
                      variant="rounded"
                      height={20}
                      sx={{ borderRadius: 999, bgcolor: "rgba(0,0,0,0.05)" }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={totalColumns} sx={{ border: "none" }}>
                <Box py={6} textAlign="center">
                  <Typography fontSize="2rem" mb={1}>🗂️</Typography>
                  <Typography fontWeight={700} fontSize="0.9rem" color="text.primary">
                    {emptyText}
                  </Typography>
                  <Typography fontSize="0.78rem" color="text.disabled" mt={0.5}>
                    Intenta ajustar los filtros
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <Fade in key={index}>
                <TableRow
                  sx={{
                    transition: "background 0.15s ease",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.025)" },
                    "&:last-child td": { borderBottom: "none" },
                    "& td": {
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      py: 1.6,
                    },
                  }}
                >
                  {visibleColumns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      align={col.align ?? "left"}
                      sx={{ fontSize: "0.875rem", color: "text.primary" }}
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
                            width: 32,
                            height: 32,
                            borderRadius: 999,
                            bgcolor: "rgba(0,0,0,0.05)",
                            border: "1px solid rgba(0,0,0,0.07)",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.09)" },
                          }}
                        >
                          <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      ) : (
                        <Box display="flex" gap={0.8} justifyContent="flex-end">
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
              onRowsPerPageChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              labelRowsPerPage="Filas"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
              SelectProps={{ native: true }}
              sx={{
                borderTop: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "rgba(0,0,0,0.015)",
                "& .MuiTablePagination-toolbar": {
                  minHeight: 52,
                  px: 2,
                  gap: 1,
                },
                "& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel": {
                  fontSize: "0.8rem",
                  color: "text.secondary",
                  margin: 0,
                },
                "& .MuiTablePagination-select": {
                  fontSize: "0.8rem",
                },
                "& .MuiTablePagination-actions button": {
                  borderRadius: 999,
                  width: 32,
                  height: 32,
                },
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>

      {/* MENÚ ACCIONES MOBILE */}
      {isMobile && actions && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: 180,
              overflow: "hidden",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              bgcolor: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
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