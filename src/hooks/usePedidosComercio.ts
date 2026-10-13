import { useCallback, useEffect, useState, useRef } from "react";
import Swal from "../utils/sweetalert";
import { pedidosComercioApi } from "../services/pedidosComercioApi";
import { extraerMensajeError } from "../utils/errorHandler";
import type {
  ComercioPedidoSelectorDto,
  EstadoPagoPedido,
  EstadoPedido,
  PagedResponse,
  PedidoComercioDetalleDto,
  PedidoComercioListadoDto,
  PedidosComercioDashboardDto,
  RegistrarReembolsoPedidoDto,
} from "../types/User/pedidosComercio";

const vacio: PagedResponse<PedidoComercioListadoDto> = {
  page: 1,
  pageSize: 10,
  totalPages: 0,
  totalItems: 0,
  items: [],
};

export const usePedidosComercio = () => {
  const operacionEnCurso = useRef(false);
  const [comercios, setComercios] = useState<ComercioPedidoSelectorDto[]>([]);
  const [comercioId, setComercioId] = useState(0);
  const [dashboard, setDashboard] =
    useState<PedidosComercioDashboardDto | null>(null);
  const [pedidos, setPedidos] = useState(vacio);
  const [detalle, setDetalle] = useState<PedidoComercioDetalleDto | null>(null);
  const [pagina, setPagina] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtro, setFiltro] = useState<EstadoPedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void pedidosComercioApi
      .comercios()
      .then(({ data }) => {
        setComercios(data.respuesta ?? []);
        setComercioId((actual) => actual || data.respuesta?.[0]?.id || 0);
      })
      .catch(() => setError("No fue posible cargar tus comercios."));
  }, []);

  const cargar = useCallback(async () => {
    if (!comercioId) return;
    setLoading(true);
    setError(null);
    try {
      const [resumen, lista] = await Promise.all([
        pedidosComercioApi.dashboard(comercioId),
        pedidosComercioApi.listar(comercioId, pagina, rowsPerPage, filtro),
      ]);
      setDashboard(resumen.data.respuesta);
      setPedidos(lista.data.respuesta);
    } catch (error: unknown) {
      setError(
        extraerMensajeError(error, "No fue posible cargar los pedidos."),
      );
    } finally {
      setLoading(false);
    }
  }, [comercioId, pagina, rowsPerPage, filtro]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const seleccionar = useCallback(
    async (uuid: string) => {
      if (!comercioId) return;
      setProcesando(true);
      try {
        const { data } = await pedidosComercioApi.detalle(comercioId, uuid);
        setDetalle(data.respuesta);
      } catch {
        await Swal.fire("Error", "No fue posible abrir el pedido.", "error");
      } finally {
        setProcesando(false);
      }
    },
    [comercioId],
  );

  const cambiarEstado = useCallback(
    async (
      estado: EstadoPedido,
      comentario?: string,
      productosRestituibles?: { detalleUuid: string; cantidad: number }[],
    ) => {
      if (!detalle || !comercioId || operacionEnCurso.current) return false;
      operacionEnCurso.current = true;
      setProcesando(true);
      try {
        const { data } = await pedidosComercioApi.cambiarEstado(
          comercioId,
          detalle.uuid,
          estado,
          detalle.version,
          comentario,
          productosRestituibles,
        );
        setDetalle(data.respuesta);
        await cargar();
        return true;
      } catch (error: unknown) {
        await Swal.fire(
          "No se pudo actualizar",
          extraerMensajeError(error, "Revisa el estado del pedido."),
          "error",
        );
        await seleccionar(detalle.uuid);
        return false;
      } finally {
        operacionEnCurso.current = false;
        setProcesando(false);
      }
    },
    [detalle, comercioId, cargar, seleccionar],
  );

  const revisarPago = useCallback(
    async (estadoPago: EstadoPagoPedido, comentario?: string) => {
      if (!detalle || !comercioId || operacionEnCurso.current) return false;
      operacionEnCurso.current = true;
      setProcesando(true);
      try {
        const { data } = await pedidosComercioApi.revisarPago(
          comercioId,
          detalle.uuid,
          estadoPago,
          detalle.version,
          comentario,
        );
        setDetalle(data.respuesta);
        await cargar();
        return true;
      } catch (error: unknown) {
        await Swal.fire(
          "No se pudo revisar",
          extraerMensajeError(error, "Intenta nuevamente."),
          "error",
        );
        await seleccionar(detalle.uuid);
        return false;
      } finally {
        operacionEnCurso.current = false;
        setProcesando(false);
      }
    },
    [detalle, comercioId, cargar, seleccionar],
  );

  const registrarReembolso = async (dto: RegistrarReembolsoPedidoDto) => {
    if (!detalle || !comercioId || operacionEnCurso.current)
      throw new Error("Hay otra operación en curso.");
    operacionEnCurso.current = true;
    setProcesando(true);
    try {
      const { data } = await pedidosComercioApi.reembolsar(
        comercioId,
        detalle.uuid,
        dto,
      );
      if (data.codigo !== "200" || !data.respuesta?.reembolso)
        throw new Error(data.mensaje || "No se confirmó el reembolso.");
      setDetalle(data.respuesta);
      void cargar();
      return data.respuesta;
    } finally {
      operacionEnCurso.current = false;
      setProcesando(false);
    }
  };

  const conciliarInventario = async (
    referencia: string,
    stockDescontado: { detalleUuid: string; cantidad: number }[],
    restituirReserva?: boolean,
  ) => {
    if (!detalle || !comercioId || operacionEnCurso.current) return false;
    operacionEnCurso.current = true;
    setProcesando(true);
    try {
      const { data } = await pedidosComercioApi.conciliar(
        comercioId,
        detalle.uuid,
        detalle.version,
        referencia,
        stockDescontado,
        restituirReserva,
      );
      setDetalle(data.respuesta);
      void cargar();
      return true;
    } catch (error) {
      await Swal.fire(
        "No se pudo conciliar",
        extraerMensajeError(
          error,
          "Actualiza el pedido y revisa el inventario.",
        ),
        "error",
      );
      await seleccionar(detalle.uuid);
      return false;
    } finally {
      operacionEnCurso.current = false;
      setProcesando(false);
    }
  };

  const abrirComprobante = useCallback(async () => {
    if (!detalle || !comercioId) return null;
    const { data } = await pedidosComercioApi.comprobante(
      comercioId,
      detalle.uuid,
    );
    return URL.createObjectURL(data);
  }, [detalle, comercioId]);

  const cambiarComercio = (id: number) => {
    setComercioId(id);
    setPagina(1);
    setDetalle(null);
  };
  const cambiarFiltro = (estado: EstadoPedido | null) => {
    setFiltro(estado);
    setPagina(1);
    setDetalle(null);
  };

  const cambiarRowsPerPage = (rows: number) => {
    setRowsPerPage(rows);
    setPagina(1);
    setDetalle(null);
  };

  return {
    comercios,
    comercioId,
    dashboard,
    pedidos,
    detalle,
    pagina,
    rowsPerPage,
    filtro,
    loading,
    procesando,
    error,
    setPagina,
    cambiarRowsPerPage,
    cambiarComercio,
    cambiarFiltro,
    seleccionar,
    setDetalle,
    cambiarEstado,
    revisarPago,
    abrirComprobante,
    registrarReembolso,
    conciliarInventario,
  };
};
