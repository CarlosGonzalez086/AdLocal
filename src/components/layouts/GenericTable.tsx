import React, {
  type ReactNode,
  type Key as ReactKey,
} from "react";
import {
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
  useMediaQuery,
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
  const isMobile = useMediaQuery("(max-width: 1199.98px)");
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

  // Render Empty State con clases oficiales AdLocal
  const renderEmptyState = () => (
    <div className="empty-state-adlocal">
      <div className="empty-state-adlocal-icon">
        <MaterialSymbol icon="folder_open" size="large" />
      </div>
      <h3 className="empty-state-adlocal-title">{emptyText}</h3>
      {emptyDescription && (
        <p className="empty-state-adlocal-desc">{emptyDescription}</p>
      )}
    </div>
  );

  // ==========================================
  // RESPONSIVE CARDS VIEW (< 1200px, Bootstrap xl)
  // ==========================================
  if (isCardsMode) {
    const primaryCol = columns[0];
    const secondaryCols = columns.slice(1);

    return (
      <div className="w-100">
        {loading ? (
          <div className="d-flex flex-column gap-3">
            {[1, 2, 3].map((i) => (
              <div key={`mobile-skeleton-${i}`} className="card-adlocal p-3">
                <div className="d-flex justify-content-between mb-2">
                  <Skeleton variant="rounded" width="50%" height={24} />
                  <Skeleton variant="rounded" width="20%" height={24} />
                </div>
                <Skeleton variant="rounded" width="90%" height={16} className="mb-2" />
                <Skeleton variant="rounded" width="70%" height={16} />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="card-adlocal">
            {renderEmptyState()}
          </div>
        ) : (
          <div className="table-adlocal-card-grid d-grid gap-3">
            {data.map((row, index) => {
              const rowKey = getRowKey(row, index);

              return (
                <div key={rowKey} className="card-adlocal card-adlocal-interactive table-adlocal-mobile-card">
                  <div className="card-adlocal-body">
                    {/* Header: First column */}
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                      <div className="min-w-0 flex-grow-1">
                        <span className="fz-caption fw-bold text-uppercase text-muted d-block">
                          {primaryCol?.label}
                        </span>
                        <div className="mt-1">
                          {primaryCol?.render ? (
                            primaryCol.render(row)
                          ) : (
                            <span className="fz-h6 fw-bold text-dark">
                              {getCellValue(row, primaryCol?.key ?? "")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr className="my-2 border-light-subtle" />

                    {/* Secondary columns: 2-column key-value grid */}
                    <div className="row g-2">
                      {secondaryCols
                        .filter((col) => !col.hideOnMobileCard)
                        .map((col) => (
                          <div key={String(col.key)} className="col-12 col-sm-6">
                            <span className="fz-caption fw-bold text-uppercase text-muted d-block mb-1">
                              {col.label}
                            </span>
                            <div className="fz-body-sm text-dark">
                              {col.render
                                ? col.render(row)
                                : getCellValue(row, col.key)}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Acciones directas en móvil */}
                    {actions && (
                      <>
                        <hr className="my-2 border-light-subtle" />
                        <div
                          className="table-adlocal-actions d-flex align-items-center justify-content-start gap-2 flex-wrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {actions(row)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Mobile Compact Pagination */}
            {!loading && total > rowsPerPage && (
              <div className="card-adlocal table-adlocal-mobile-pagination p-2 d-flex flex-row align-items-center justify-content-between">
                <IconButton
                  aria-label="Página anterior"
                  size="small"
                  disabled={page === 0}
                  onClick={() => onPageChange(page - 1)}
                  className="btn-adlocal-ghost p-1"
                >
                  <ArrowBackIosNewRoundedIcon sx={{ fontSize: 13 }} />
                </IconButton>

                <span className="fz-body-sm fw-semibold text-muted">
                  Página {page + 1} de {totalPages} ({total} registros)
                </span>

                <IconButton
                  aria-label="Página siguiente"
                  size="small"
                  disabled={page >= totalPages - 1}
                  onClick={() => onPageChange(page + 1)}
                  className="btn-adlocal-ghost p-1"
                >
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // DESKTOP VIEW (>= 1200px)
  // ==========================================
  return (
    <div className="w-100">
      <TableContainer
        className="table-adlocal-wrapper"
        sx={{
          maxHeight: "calc(100vh - 240px)",
        }}
      >
        <Table stickyHeader className="table-adlocal" aria-label="Tabla de registros">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  align={column.align ?? "left"}
                  sx={{
                    width: column.width,
                    minWidth: column.minWidth ?? 120,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}

              {actions && (
                <TableCell
                  align="right"
                  sx={{
                    width: 148,
                    minWidth: 148,
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
                  <TableRow key={rowKey} hover>
                    {columns.map((column) => (
                      <TableCell
                        key={`${String(rowKey)}-${String(column.key)}`}
                        align={column.align ?? "left"}
                      >
                        {column.render
                          ? column.render(row)
                          : getCellValue(row, column.key)}
                      </TableCell>
                    ))}

                    {actions && (
                      <TableCell align="right">
                        <div className="table-adlocal-actions d-flex align-items-center justify-content-end gap-1">
                          {actions(row)}
                        </div>
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
                  className="table-adlocal-pagination"
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
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </div>
  );
}
