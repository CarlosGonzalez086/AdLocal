import React, {
  type ReactNode,
  type Key as ReactKey,
} from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
  width?: string | number;
  minWidth?: string | number;
  hideOnMobileCard?: boolean;
}

interface GenericTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  emptyDescription?: string;
  actions?: (row: T) => ReactNode;
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  getRowKey?: (row: T, index: number) => ReactKey;
  rowsPerPageOptions?: number[];
  mobileLayout?: "cards" | "table";
}

const getCellValue = <T,>(row: T, key: keyof T | string): ReactNode => {
  if (typeof row !== "object" || row === null) {
    return "";
  }

  const value = (row as Record<string, unknown>)[String(key)];

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  return String(value);
};

const getDefaultRowKey = <T,>(row: T, index: number): ReactKey => {
  if (typeof row === "object" && row !== null && "id" in row) {
    const id = (row as { id?: unknown }).id;
    if (typeof id === "string" || typeof id === "number") {
      return id;
    }
  }
  return index;
};

export function GenericTable<T>({
  columns,
  data,
  loading = false,
  emptyText = "No hay registros",
  emptyDescription = "No hay información disponible para mostrar.",
  actions,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  getRowKey = getDefaultRowKey,
  rowsPerPageOptions = [10, 30, 100],
  mobileLayout = "cards",
}: GenericTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isCardsMode = isMobile && mobileLayout === "cards";

  const totalColumns = columns.length + (actions ? 1 : 0);

  const handlePageChange = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }
    onRowsPerPageChange(Math.floor(value));
  };

  const totalPages = Math.ceil(total / rowsPerPage) || 1;

  // Render Empty State
  const renderEmptyState = () => (
    <Box
      sx={{
        py: { xs: 5, sm: 7 },
        px: 3,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "16px",
          backgroundColor: "rgba(0, 122, 255, 0.08)",
          color: "#007AFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.5,
        }}
      >
        <MaterialSymbol icon="folder_open" size="large" />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#1C1C1E",
          mb: 0.5,
        }}
      >
        {emptyText}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontSize: "13.5px",
          color: "#6E6E73",
          maxWidth: 360,
          lineHeight: 1.4,
        }}
      >
        {emptyDescription}
      </Typography>
    </Box>
  );

  // ==========================================
  // MOBILE CARDS VIEW (< 768px)
  // ==========================================
  if (isCardsMode) {
    const primaryCol = columns[0];
    const secondaryCols = columns.slice(1);

    return (
      <Box sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {[1, 2, 3].map((i) => (
              <Card
                key={`mobile-skeleton-${i}`}
                sx={{
                  p: 2,
                  borderRadius: "14px",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Skeleton variant="rounded" width="50%" height={24} />
                  <Skeleton variant="rounded" width="20%" height={24} />
                </Box>
                <Skeleton variant="rounded" width="90%" height={16} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width="70%" height={16} />
              </Card>
            ))}
          </Box>
        ) : data.length === 0 ? (
          <Card
            sx={{
              borderRadius: "14px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
            }}
          >
            {renderEmptyState()}
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {data.map((row, index) => {
              const rowKey = getRowKey(row, index);

              return (
                <Card
                  key={rowKey}
                  sx={{
                    borderRadius: "14px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                    overflow: "visible",
                    transition: "all 0.15s ease",
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    {/* Header: First column */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1.5,
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#8E8E93",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            display: "block",
                          }}
                        >
                          {primaryCol?.label}
                        </Typography>
                        <Box sx={{ mt: 0.2 }}>
                          {primaryCol?.render
                            ? primaryCol.render(row)
                            : (
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: 700,
                                  color: "#1C1C1E",
                                }}
                              >
                                {getCellValue(row, primaryCol?.key ?? "")}
                              </Typography>
                            )}
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.2, borderColor: "rgba(0, 0, 0, 0.05)" }} />

                    {/* Secondary columns: 2-column key-value grid */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 1.5,
                      }}
                    >
                      {secondaryCols
                        .filter((col) => !col.hideOnMobileCard)
                        .map((col) => (
                          <Box key={String(col.key)} sx={{ minWidth: 0 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#8E8E93",
                                fontSize: "11px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                display: "block",
                                mb: 0.2,
                              }}
                            >
                              {col.label}
                            </Typography>
                            <Box sx={{ fontSize: "13.5px", color: "#1C1C1E" }}>
                              {col.render
                                ? col.render(row)
                                : getCellValue(row, col.key)}
                            </Box>
                          </Box>
                        ))}
                    </Box>

                    {/* Acciones directas en móvil */}
                    {actions && (
                      <>
                        <Divider sx={{ my: 1.5, borderColor: "rgba(0, 0, 0, 0.06)" }} />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {actions(row)}
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Mobile Compact Pagination */}
            {!loading && total > rowsPerPage && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  mt: 0.5,
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                <IconButton
                  size="small"
                  disabled={page === 0}
                  onClick={() => onPageChange(page - 1)}
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    p: 0.8,
                  }}
                >
                  <ArrowBackIosNewRoundedIcon sx={{ fontSize: 13 }} />
                </IconButton>

                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#6E6E73" }}>
                  Página {page + 1} de {totalPages} ({total} registros)
                </Typography>

                <IconButton
                  size="small"
                  disabled={page >= totalPages - 1}
                  onClick={() => onPageChange(page + 1)}
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    p: 0.8,
                  }}
                >
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  }

  // ==========================================
  // DESKTOP & TABLET VIEW (>= 768px)
  // ==========================================
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "14px",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          maxHeight: "calc(100vh - 240px)",
          overflowX: "auto",
        }}
      >
        <Table stickyHeader aria-label="Tabla de registros">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  align={column.align ?? "left"}
                  sx={{
                    width: column.width,
                    minWidth: column.minWidth ?? 120,
                    backgroundColor: "#F8F9FA",
                    color: "#6E6E73",
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #E5E5EA",
                    py: 1.5,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}

              {actions && (
                <TableCell
                  align="right"
                  sx={{
                    backgroundColor: "#F8F9FA",
                    color: "#6E6E73",
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #E5E5EA",
                    width: 110,
                    minWidth: 110,
                    py: 1.5,
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: Math.min(rowsPerPage, 5) }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {Array.from({ length: totalColumns }).map((_, columnIndex) => (
                    <TableCell
                      key={`skeleton-cell-${rowIndex}-${columnIndex}`}
                      sx={{ py: 2 }}
                    >
                      <Skeleton
                        variant="rounded"
                        height={20}
                        sx={{ borderRadius: "6px" }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumns}
                  sx={{ borderBottom: "none", p: 0 }}
                >
                  {renderEmptyState()}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const rowKey = getRowKey(row, index);

                return (
                  <TableRow
                    key={rowKey}
                    hover
                    sx={{
                      transition: "background-color 0.15s ease",
                      "&:hover": {
                        backgroundColor: "rgba(0, 122, 255, 0.025) !important",
                      },
                      "&:last-child td": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={`${String(rowKey)}-${String(column.key)}`}
                        align={column.align ?? "left"}
                        sx={{
                          fontSize: "14px",
                          color: "#1C1C1E",
                          py: 1.6,
                        }}
                      >
                        {column.render
                          ? column.render(row)
                          : getCellValue(row, column.key)}
                      </TableCell>
                    ))}

                    {actions && (
                      <TableCell align="right" sx={{ py: 1.6 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 0.5,
                          }}
                        >
                          {actions(row)}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>

          {!loading && total > 0 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={totalColumns}
                  rowsPerPageOptions={rowsPerPageOptions}
                  count={total}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsChange}
                  labelRowsPerPage="Filas:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                  SelectProps={{
                    native: true,
                  }}
                  sx={{
                    borderTop: "1px solid #E5E5EA",
                    color: "#6E6E73",
                    fontSize: "13px",
                    "& .MuiTablePagination-select": {
                      fontWeight: 600,
                    },
                  }}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
