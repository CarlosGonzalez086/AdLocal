import { Avatar, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GroupIcon from "@mui/icons-material/Group";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GenericTable, type TableColumn } from "../layouts/GenericTable";
import ModalAgregarColaborador from "../User/ModalAgregarColaborador";
import ModalColaboradores from "../User/ModalColaboradores";
import type { ListarParamsComercio } from "../../hooks/useComercio";
import type {
  ColaborarDto,
  ComercioDtoListItem,
} from "../../types/User/comercio";

interface Props {
  data: ComercioDtoListItem[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  total: number;

  onPageChange: (page: number) => void;

  onRowsPerPageChange: (rows: number) => void;

  eliminarFromTable: (
    id: number,
    refrescarParams: ListarParamsComercio,
  ) => void;

  onSaveColaborador: (data: ColaborarDto) => void;
}

export function ComerciosTable(props: Props) {
  const [openModal, setOpenModal] = useState(false);

  const [openModalColaboradores, setOpenModalColaboradores] = useState(false);

  const [idRow, setIdRow] = useState(0);

  const columns: TableColumn<ComercioDtoListItem>[] = [
    {
      key: "Nombre",
      label: "Nombre",

      render: (comercio) => (
        <div className="d-flex align-items-center gap-2">
          <Avatar
            src={comercio.logoUrl}
            alt={`Logotipo de ${comercio.nombre}`}
            className="commerceTableAvatar"
          />

          <span className="fz-h4 fw-semibold commerceTableBusinessName">
            {comercio.nombre}
          </span>
        </div>
      ),
    },
    {
      key: "telefono",
      label: "Teléfono",
    },
    {
      key: "email",
      label: "Correo",
    },
    {
      key: "direccion",
      label: "Dirección",
    },
  ];

  const handleOpenModal = (id: number) => {
    setIdRow(id);
    setOpenModal(true);
  };

  const handleOpenCollaboratorsModal = (id: number) => {
    setIdRow(id);

    setOpenModalColaboradores(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIdRow(0);
  };

  const handleCloseCollaboratorsModal = () => {
    setOpenModalColaboradores(false);

    setIdRow(0);
  };

  const handleDelete = (id: number) => {
    props.eliminarFromTable(id, {
      page: props.page,

      rowsPerPage: props.rowsPerPage,
    });
  };

  return (
    <div className="commerceTableContainer">
      <GenericTable<ComercioDtoListItem>
        {...props}
        columns={columns}
        emptyText="No hay comercios registrados"
        actions={(comercio) => (
          <div className="d-flex align-items-center gap-1">
            <Tooltip
              title="Editar negocio"
              arrow
              enterDelay={300}
              placement="top"
              slotProps={{
                tooltip: {
                  className: "commerceTableTooltip",
                },
              }}
            >
              <span>
                <IconButton
                  component={Link}
                  to={`editar/${comercio.id}`}
                  size="small"
                  className="commerceTableActionButton"
                  aria-label={`Editar ${comercio.nombre}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip
              title="Eliminar negocio"
              arrow
              enterDelay={300}
              placement="top"
              slotProps={{
                tooltip: {
                  className: "commerceTableTooltip",
                },
              }}
            >
              <span>
                <IconButton
                  type="button"
                  size="small"
                  color="error"
                  className="commerceTableActionButton commerceTableDeleteButton"
                  onClick={() => handleDelete(comercio.id)}
                  aria-label={`Eliminar ${comercio.nombre}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            {comercio.idColaborador === 0 && (
              <Tooltip
                title="Agregar colaborador"
                arrow
                enterDelay={300}
                placement="top"
                slotProps={{
                  tooltip: {
                    className: "commerceTableTooltip",
                  },
                }}
              >
                <span>
                  <IconButton
                    type="button"
                    size="small"
                    className="commerceTableActionButton"
                    onClick={() => handleOpenModal(comercio.id)}
                    aria-label={`Agregar colaborador a ${comercio.nombre}`}
                  >
                    <ManageAccountsIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            <Tooltip
              title="Ver colaboradores"
              arrow
              enterDelay={300}
              placement="top"
              slotProps={{
                tooltip: {
                  className: "commerceTableTooltip",
                },
              }}
            >
              <span>
                <IconButton
                  type="button"
                  size="small"
                  className="commerceTableActionButton"
                  onClick={() => handleOpenCollaboratorsModal(comercio.id)}
                  aria-label={`Ver colaboradores de ${comercio.nombre}`}
                >
                  <GroupIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        )}
      />

      {openModal && (
        <ModalAgregarColaborador
          open={openModal}
          id={idRow}
          onSubmit={(colaborador) => {
            props.onSaveColaborador({
              idComercio: colaborador.idComercio,
              nombre: colaborador.nombre,
              correo: colaborador.correo,
            });
          }}
          onClose={handleCloseModal}
        />
      )}

      {openModalColaboradores && (
        <ModalColaboradores
          open={openModalColaboradores}
          id={idRow}
          onClose={handleCloseCollaboratorsModal}
        />
      )}
    </div>
  );
}
