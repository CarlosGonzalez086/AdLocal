import { Badge, IconButton, Menu } from "@mui/material";
import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import MaterialSymbol from "../../components/UI/MaterialSymbol/MaterialSymbol";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import type { Notificacion } from "../../types/notificaciones";

export default function NotificacionesMenu() {
  const navigate = useNavigate();
  const [ancla, setAncla] = useState<HTMLElement | null>(null);
  const { notificaciones, noLeidas, leer, leerTodas } = useNotificaciones(true);

  const abrir = async (item: Notificacion) => {
    await leer(item);
    setAncla(null);
    if (item.url) navigate(item.url);
  };

  return <>
    <IconButton className="notification-button" aria-label={`${noLeidas} notificaciones sin leer`} onClick={(event: MouseEvent<HTMLElement>) => setAncla(event.currentTarget)}>
      <Badge badgeContent={noLeidas} color="error" max={99}>
        <MaterialSymbol icon="notifications" size="small" filled />
      </Badge>
    </IconButton>
    <Menu anchorEl={ancla} open={Boolean(ancla)} onClose={() => setAncla(null)} slotProps={{ paper: { className: "notification-menu" } }}>
      <div className="d-flex align-items-center justify-content-between px-3 py-2">
        <h2 className="fz-h4 fw-bold mb-0">Notificaciones</h2>
        {noLeidas > 0 && <button type="button" className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm" onClick={() => void leerTodas()}>Leer todas</button>}
      </div>
      {notificaciones.length === 0 ? <p className="notification-empty fz-h5 mb-0 px-3 py-4">No tienes notificaciones.</p> : notificaciones.map((item) =>
        <button key={item.uuid} type="button" className={`notification-item w-100 text-start px-3 py-2 ${item.leida ? "" : "notification-item--unread"}`} onClick={() => void abrir(item)}>
          <span className="d-block fz-h5 fw-bold">{item.titulo}</span>
          <span className="d-block fz-small">{item.mensaje}</span>
          <span className="d-block notification-date fz-small">{new Date(item.fechaCreacion).toLocaleString("es-MX")}</span>
        </button>)}
    </Menu>
  </>;
}
