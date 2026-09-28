import { describe, it, expect } from 'vitest';
import {
  EstadoPedido,
} from '../types/User/pedidosComercio';

describe('Flujo de Gestión de Pedidos del Comercio (AdLocal)', () => {
  // Matriz de transiciones permitidas según reglas de negocio de la plataforma
  const transicionesPermitidas: Record<EstadoPedido, EstadoPedido[]> = {
    [EstadoPedido.PendienteAprobacion]: [
      EstadoPedido.Aprobado,
      EstadoPedido.Rechazado,
      EstadoPedido.Cancelado,
    ],
    [EstadoPedido.Aprobado]: [
      EstadoPedido.Preparando,
      EstadoPedido.ListoParaRecoger,
      EstadoPedido.ListoParaEnviar,
      EstadoPedido.Cancelado,
    ],
    [EstadoPedido.Preparando]: [
      EstadoPedido.ListoParaRecoger,
      EstadoPedido.ListoParaEnviar,
      EstadoPedido.Enviado,
      EstadoPedido.Cancelado,
    ],
    [EstadoPedido.ListoParaRecoger]: [
      EstadoPedido.Entregado,
      EstadoPedido.Completado,
      EstadoPedido.Cancelado,
    ],
    [EstadoPedido.ListoParaEnviar]: [
      EstadoPedido.Enviado,
      EstadoPedido.Cancelado,
    ],
    [EstadoPedido.Enviado]: [
      EstadoPedido.Entregado,
      EstadoPedido.Completado,
    ],
    [EstadoPedido.Entregado]: [
      EstadoPedido.Completado,
    ],
    [EstadoPedido.Completado]: [], // Estado terminal
    [EstadoPedido.Cancelado]: [],  // Estado terminal
    [EstadoPedido.Rechazado]: [],  // Estado terminal
  };

  const puedeTransicionar = (origen: EstadoPedido, destino: EstadoPedido): boolean => {
    return transicionesPermitidas[origen]?.includes(destino) ?? false;
  };

  describe('1. Reglas de transición de estados de pedido', () => {
    it('debe permitir aprobar o rechazar un pedido pendiente de aprobación', () => {
      expect(puedeTransicionar(EstadoPedido.PendienteAprobacion, EstadoPedido.Aprobado)).toBe(true);
      expect(puedeTransicionar(EstadoPedido.PendienteAprobacion, EstadoPedido.Rechazado)).toBe(true);
    });

    it('no debe permitir saltos directos de pendiente a completado o entregado', () => {
      expect(puedeTransicionar(EstadoPedido.PendienteAprobacion, EstadoPedido.Completado)).toBe(false);
      expect(puedeTransicionar(EstadoPedido.PendienteAprobacion, EstadoPedido.Entregado)).toBe(false);
    });

    it('debe proteger estados terminales impidiendo transiciones posteriores', () => {
      expect(puedeTransicionar(EstadoPedido.Completado, EstadoPedido.Aprobado)).toBe(false);
      expect(puedeTransicionar(EstadoPedido.Cancelado, EstadoPedido.Preparando)).toBe(false);
      expect(puedeTransicionar(EstadoPedido.Rechazado, EstadoPedido.Aprobado)).toBe(false);
    });
  });

  describe('2. Validación de motivo/comentario ante rechazo o cancelación', () => {
    const validarCambioEstado = (
      nuevoEstado: EstadoPedido,
      comentario?: string
    ): { valido: boolean; error?: string } => {
      const requiereMotivo =
        nuevoEstado === EstadoPedido.Rechazado || nuevoEstado === EstadoPedido.Cancelado;

      if (requiereMotivo && (!comentario || comentario.trim().length < 5)) {
        return {
          valido: false,
          error: 'Debe proporcionar un motivo de al menos 5 caracteres.',
        };
      }
      return { valido: true };
    };

    it('debe exigir comentario explicativo de al menos 5 caracteres al rechazar un pedido', () => {
      expect(validarCambioEstado(EstadoPedido.Rechazado)).toEqual({
        valido: false,
        error: 'Debe proporcionar un motivo de al menos 5 caracteres.',
      });

      expect(validarCambioEstado(EstadoPedido.Rechazado, '  ')).toEqual({
        valido: false,
        error: 'Debe proporcionar un motivo de al menos 5 caracteres.',
      });

      expect(validarCambioEstado(EstadoPedido.Rechazado, 'No hay stock')).toEqual({
        valido: true,
      });
    });

    it('no requiere comentario obligatorio al avanzar a preparación o entrega', () => {
      expect(validarCambioEstado(EstadoPedido.Preparando)).toEqual({ valido: true });
      expect(validarCambioEstado(EstadoPedido.Entregado)).toEqual({ valido: true });
    });
  });

  describe('3. Construcción de parámetros de consulta para listados del comercio', () => {
    const construirParamsListar = (
      comercioId: number,
      page = 1,
      pageSize = 10,
      estado?: EstadoPedido | null
    ) => {
      return {
        comercioId,
        page,
        pageSize,
        ...(estado !== null && estado !== undefined ? { estado } : {}),
      };
    };

    it('debe estructurar los parámetros básicos de paginación', () => {
      const params = construirParamsListar(15, 2, 20);
      expect(params).toEqual({
        comercioId: 15,
        page: 2,
        pageSize: 20,
      });
    });

    it('debe incluir el filtro de estado si está presente y excluirlo si es nulo', () => {
      const conFiltro = construirParamsListar(15, 1, 10, EstadoPedido.PendienteAprobacion);
      expect(conFiltro).toEqual({
        comercioId: 15,
        page: 1,
        pageSize: 10,
        estado: EstadoPedido.PendienteAprobacion,
      });

      const sinFiltro = construirParamsListar(15, 1, 10, null);
      expect(sinFiltro).not.toHaveProperty('estado');
    });
  });
});
