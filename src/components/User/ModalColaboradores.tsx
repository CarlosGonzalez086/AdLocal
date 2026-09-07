import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GenericTable, type TableColumn } from "../layouts/GenericTable";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useComercio } from "../../hooks/useComercio";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import type { ProfileUser } from "../../types/User/UserAuth";

interface Props {
  open: boolean;
  onClose: () => void;
  id: number;
}

export default function ModalColaboradores({ open, onClose, id }: Props) {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const {
    loading,
    usersColaboradores,
    totalColaboradores,
    getAllColaboradores,
    eliminarColaborador,
    toggleAccesoColaborador,
  } = useComercio();

  const columns: TableColumn<ProfileUser>[] = [
    {
      key: "nombre",
      label: "Nombre",
    },
    {
      key: "email",
      label: "Correo",
    },
    {
      key: "activo",
      label: "Estado",
      render: (p) => (
        <span
          className={`badge-adlocal ${
            p.activo ? "badge-adlocal-success" : "badge-adlocal-neutral"
          }`}
        >
          {p.activo ? "Con acceso" : "Sin acceso"}
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (id) {
      getAllColaboradores(id, page, rows);
    }
  }, [id, page, rows, getAllColaboradores]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.95), rgba(245,245,245,.92))",
          boxShadow: "0 30px 80px rgba(0,0,0,.25)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="fz-h5 fw-bold mb-0">
            Colaboradores
          </h2>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="card-adlocal overflow-hidden">
          <GenericTable<ProfileUser>
            columns={columns}
            data={usersColaboradores}
            loading={loading}
            emptyText="No hay colaboradores registrados"
            page={page}
            rowsPerPage={rows}
            total={totalColaboradores}
            onPageChange={setPage}
            onRowsPerPageChange={(r) => {
              setRows(r);
              setPage(0);
            }}
            actions={(p) => (
              <div className="d-flex flex-row gap-1 p-1">
                <Tooltip title={p.activo ? "Quitar acceso" : "Dar acceso"} disableTouchListener>
                  <IconButton
                    size="small"
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "var(--bg-soft)",
                      color: "var(--text)",
                      "&:hover": { bgcolor: "var(--border)" },
                    }}
                    onClick={() => {
                      toggleAccesoColaborador(p.id, id, {
                        idComercio: id,
                        page: page,
                        rowsPerPage: rows,
                      });
                    }}
                  >
                    {p.activo ? (
                      <LockIcon fontSize="small" />
                    ) : (
                      <LockOpenIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar" disableTouchListener>
                  <IconButton
                    size="small"
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "var(--error-subtle)",
                      color: "var(--error)",
                      "&:hover": { bgcolor: "rgba(216, 64, 40, 0.18)" },
                    }}
                    onClick={() => {
                      eliminarColaborador(p.id, id, {
                        idComercio: id,
                        page: page,
                        rowsPerPage: rows,
                      });
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
