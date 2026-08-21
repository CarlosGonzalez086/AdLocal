import {
  IconButton,
  Menu,
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
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useTheme } from "@mui/material/styles";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import {
  type ReactNode,
  type Key as ReactKey,
  useState,
  type MouseEvent,
} from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
  width?: string | number;
  minWidth?: string | number;
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
}

const getCellValue = <T,>(row: T, key: keyof T | string): ReactNode => {
  if (typeof row !== "object" || row === null) {
    return "";
  }

  const value = (row as Record<string, unknown>)[String(key)];

  if (value === null || value === undefined) {
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
    const id = (
      row as {
        id?: unknown;
      }
    ).id;

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
}: GenericTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const visibleColumns = isMobile ? columns.slice(0, 2) : columns;
  const totalColumns = visibleColumns.length + (actions ? 1 : 0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(event.currentTarget);

    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);

    setSelectedRow(null);
  };

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

  return (
    <div className="genericTableWrapper">
      <TableContainer className="genericTableContainer">
        <Table className="genericTable" aria-label="Tabla de registros">
          <TableHead>
            <TableRow className="genericTableHeadRow">
              {visibleColumns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  align={column.align ?? "left"}
                  className="genericTableHeadCell fz-h5 fw-bold"
                  style={{
                    width: column.width,

                    minWidth: column.minWidth,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}

              {actions && (
                <TableCell
                  align="right"
                  className="genericTableHeadCell genericTableActionsHeadCell fz-h5 fw-bold"
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({
                length: Math.min(rowsPerPage, 5),
              }).map((_, rowIndex) => (
                <TableRow
                  key={`skeleton-${rowIndex}`}
                  className="genericTableBodyRow"
                >
                  {Array.from({
                    length: totalColumns,
                  }).map((_, columnIndex) => (
                    <TableCell
                      key={`skeleton-${rowIndex}-${columnIndex}`}
                      className="genericTableSkeletonCell"
                    >
                      <Skeleton
                        variant="rounded"
                        height={20}
                        className="genericTableSkeleton"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumns}
                  className="genericTableEmptyCell"
                >
                  <div className="genericTableEmpty">
                    <div className="genericTableEmptyIcon">
                      <MaterialSymbol icon="folder_off" size="large" />
                    </div>

                    <h3 className="genericTableEmptyTitle fz-h3 fw-bold mb-1">
                      {emptyText}
                    </h3>

                    <p className="genericTableEmptyDescription fz-h5 fw-regular mb-0">
                      {emptyDescription}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const rowKey = getRowKey(row, index);

                return (
                  <TableRow key={rowKey} hover className="genericTableBodyRow">
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={`${String(rowKey)}-${String(column.key)}`}
                        align={column.align ?? "left"}
                        className="genericTableBodyCell fz-h4 fw-regular"
                      >
                        {column.render
                          ? column.render(row)
                          : getCellValue(row, column.key)}
                      </TableCell>
                    ))}

                    {actions && (
                      <TableCell
                        align="right"
                        className="genericTableActionsCell"
                      >
                        {isMobile ? (
                          <IconButton
                            type="button"
                            size="small"
                            className="genericTableMobileActionsButton"
                            onClick={(event) => handleMenuOpen(event, row)}
                            aria-label="Mostrar acciones"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen ? "true" : undefined}
                          >
                            <MoreVertRoundedIcon className="genericTableMoreIcon" />
                          </IconButton>
                        ) : (
                          <div className="d-flex align-items-center justify-content-end gap-1">
                            {actions(row)}
                          </div>
                        )}
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
                  labelRowsPerPage="Filas por página"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                  SelectProps={{
                    native: true,

                    className: "fz-h5 fw-medium",
                  }}
                  className="genericTablePagination"
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>

      {isMobile && actions && (
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          className="genericTableActionsMenu"
          slotProps={{
            paper: {
              className: "genericTableMenuPaper",
            },
          }}
        >
          {selectedRow && (
            <div
              className="genericTableMobileActions d-flex align-items-center gap-1"
              onClickCapture={handleMenuClose}
            >
              {actions(selectedRow)}
            </div>
          )}
        </Menu>
      )}
    </div>
  );
}
