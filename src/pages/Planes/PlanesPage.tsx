import {
  IconButton,
  Button,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { LinearProgress, Typography } from "@mui/material";

import { useState } from "react";
import { usePlanes } from "../../hooks/usePlanes";
import type { PlanCreateDto } from "../../services/planApi";
import { PlanModal } from "../../components/Plan/PlanModal";

export const PlanesPage = () => {
  const initialForm: PlanCreateDto = {
    nombre: "",
    precio: 0,
    duracionDias: 0,
    tipo: "",
  };

  const { planes, loading, guardar, eliminar } = usePlanes();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(5);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [plan, setPlan] = useState<PlanCreateDto>({
    nombre: "",
    precio: 0,
    duracionDias: 0,
    tipo: "",
  });

  const data = planes.slice(page * rows, page * rows + rows);

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setPlan(initialForm);
            setOpen(true);
          }}
        >
          Nuevo
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f7ebd1" }}>
              <TableCell
                sx={{ color: "#008c82", fontWeight: "bold" }}
                align="left"
              >
                Nombre
              </TableCell>
              <TableCell
                sx={{ color: "#008c82", fontWeight: "bold" }}
                align="left"
              >
                Precio
              </TableCell>
              <TableCell
                sx={{ color: "#008c82", fontWeight: "bold" }}
                align="left"
              >
                Días
              </TableCell>
              <TableCell
                sx={{ color: "#008c82", fontWeight: "bold" }}
                align="left"
              >
                Tipo
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "#008c82", fontWeight: "bold" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
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
                <TableCell colSpan={5} align="center">
                  No hay planes registrados
                </TableCell>
              </TableRow>
            ) : (
              data.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>${p.precio}</TableCell>
                  <TableCell>{p.duracionDias}</TableCell>
                  <TableCell>{p.tipo}</TableCell>

                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setPlan(p);
                        setView(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      color="info"
                      onClick={() => {
                        setPlan(p);
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton color="error" onClick={() => eliminar(p.id!)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={planes.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rows}
        onRowsPerPageChange={(e) => {
          setRows(+e.target.value);
          setPage(0);
        }}
      />

      <PlanModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={guardar}
        plan={plan}
      />

      <PlanModal
        open={view}
        onClose={() => setView(false)}
        onSave={() => {}}
        plan={plan}
        soloVer
      />
    </div>
  );
};
