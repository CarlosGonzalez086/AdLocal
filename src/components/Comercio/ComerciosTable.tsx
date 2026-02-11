import {
  Avatar,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type {
  ColaborarDto,
  ComercioDtoListItem,
} from "../../services/comercioApi";
import { GenericTable, type TableColumn } from "../layouts/GenericTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import type { ListarParamsComercio } from "../../hooks/useComercio";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useState } from "react";
import ModalAgregarColaborador from "../User/ModalAgregarColaborador";
import GroupIcon from "@mui/icons-material/Group";
import ModalColaboradores from "../User/ModalColaboradores";

interface Props {
  data: ComercioDtoListItem[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (r: number) => void;
  eliminarFromTable: (
    id: number,
    refrescarParams: ListarParamsComercio,
  ) => void;
  onSaveColaborador: (data: ColaborarDto) => void;
}

export function ComerciosTable(props: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalColaboradores, setOpenModalColaboradores] =
    useState<boolean>(false);
  const [idRow, setIdRow] = useState<number>(0);
  const columns: TableColumn<ComercioDtoListItem>[] = [
    {
      key: "Nombre",
      label: "Nombre",
      render: (p) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={p.logoUrl} sx={{ width: 32, height: 32 }} />
          <Typography fontWeight={600}>{p.nombre}</Typography>
        </Stack>
      ),
    },
    {
      key: "telefono",
      label: "Telefono",
    },
    {
      key: "email",
      label: "Correo",
    },
    {
      key: "direccion",
      label: "Direccion",
    },
  ];
  const HandleOpenModal = (id: number) => {
    setOpenModal(true);
    setIdRow(id);
  };
  const HandleOpenModalColaboradores = (id: number) => {
    setOpenModalColaboradores(true);
    setIdRow(id);
  };
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <GenericTable<ComercioDtoListItem>
        {...props}
        columns={columns}
        emptyText="No hay comercios registrados"
        actions={(p) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip
              title="Editar negocio"
              arrow
              enterDelay={300}
              componentsProps={{
                tooltip: {
                  sx: {
                    borderRadius: 3,
                    fontSize: 12,
                    fontWeight: 500,
                  },
                },
              }}
              placement="top"
            >
              <Link
                to={`editar/${p.id}`}
                className="d-block"
                style={{ textDecoration: "none" }}
              >
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              </Link>
            </Tooltip>

            <Tooltip
              title="Eliminar negocio"
              arrow
              enterDelay={300}
              componentsProps={{
                tooltip: {
                  sx: {
                    borderRadius: 3,
                    fontSize: 12,
                    fontWeight: 500,
                  },
                },
              }}
              placement="top"
            >
              <IconButton
                size="small"
                color="error"
                onClick={() =>
                  props.eliminarFromTable(p.id, {
                    page: props.page,
                    rowsPerPage: props.rowsPerPage,
                  })
                }
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {p.idColaborador == 0 ? (
              <>
                {" "}
                <Tooltip
                  title="Agregar colaborador"
                  arrow
                  enterDelay={300}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        borderRadius: 3,
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    },
                  }}
                  placement="top"
                >
                  <IconButton
                    size="small"
                    onClick={() => HandleOpenModal(p.id)}
                  >
                    <ManageAccountsIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <></>
            )}

            <Tooltip
              title="Ver colaboradores"
              arrow
              enterDelay={300}
              componentsProps={{
                tooltip: {
                  sx: {
                    borderRadius: 3,
                    fontSize: 12,
                    fontWeight: 500,
                  },
                },
              }}
              placement="top"
            >
              <IconButton
                size="small"
                onClick={() => HandleOpenModalColaboradores(p.id)}
              >
                <GroupIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      />
      {openModal && (
        <>
          {" "}
          <ModalAgregarColaborador
            open={openModal}
            onSubmit={(e) => {
              props.onSaveColaborador({
                idComercio: e.idComercio,
                nombre: e.nombre,
                correo: e.correo,
              });
            }}
            onClose={() => {
              setOpenModal(false);
              setIdRow(0);
            }}
            id={idRow}
          />
        </>
      )}
      {openModalColaboradores && (
        <>
          {" "}
          <ModalColaboradores
            open={openModalColaboradores}
            onClose={() => {
              setOpenModalColaboradores(false);
              setIdRow(0);
            }}
            id={idRow}
          />
        </>
      )}
    </Paper>
  );
}
