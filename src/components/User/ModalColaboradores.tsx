import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GenericTable, type TableColumn } from "../layouts/GenericTable";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ProfileUser } from "../../services/userProfileApi";
import { useEffect, useState } from "react";
import { useComercio } from "../../hooks/useComercio";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

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
        <Chip
          label={p.activo ? "Con acceso" : "Sin acceso"}
          size="small"
          sx={{
            borderRadius: 1.5,
            fontWeight: 500,
            bgcolor: p.activo ? "#E9F7EF" : "#F2F2F7",
            color: p.activo ? "#1E7F4F" : "#666",
          }}
        />
      ),
    },
  ];
  useEffect(() => {
    if (id) {
      getAllColaboradores(id, page, rows);
    }
  }, [id]);
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontWeight={800} fontSize="1.1rem">
            Colaboradores
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
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
              <Stack direction="row" spacing={0.5} className="p-1">
                <Tooltip title={p.activo ? "Quitar acceso" : "Dar acceso"}>
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "#F2F2F7",
                      "&:hover": { bgcolor: "#E5E5EA" },
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

                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "#FDECEA",
                      color: "#D93025",
                      "&:hover": { bgcolor: "#FAD2CF" },
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
              </Stack>
            )}
          />
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
