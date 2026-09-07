import { describe, it, expect } from 'vitest';
import {
  getTokenRemainingSeconds,
  isTokenExpiringSoon,
} from '../services/tokenRefresh';

describe('Flujo de Expiración y Refresco de Tokens (AdLocal)', () => {
  // Helper para generar tokens JWT de prueba con claims específicos
  const base64UrlEncode = (obj: Record<string, unknown>): string => {
    const json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const createMockToken = (claims: Record<string, unknown>): string => {
    const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
    const payload = base64UrlEncode(claims);
    const signature = 'testSignature789';
    return `${header}.${payload}.${signature}`;
  };

  describe('1. Cálculo de segundos restantes (getTokenRemainingSeconds)', () => {
    it('debe retornar 0 para tokens nulos, indefinidos o vacíos', () => {
      expect(getTokenRemainingSeconds(null)).toBe(0);
      expect(getTokenRemainingSeconds(undefined)).toBe(0);
      expect(getTokenRemainingSeconds('')).toBe(0);
      expect(getTokenRemainingSeconds('token-malformado')).toBe(0);
    });

    it('debe calcular correctamente los segundos restantes de un token vigente', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = createMockToken({
        id: '10',
        rol: 'Comercio',
        exp: now + 600, // 10 minutos en el futuro
      });

      const remaining = getTokenRemainingSeconds(token);
      // Permitir tolerancia de ±3 segundos por tiempo de ejecución
      expect(remaining).toBeGreaterThanOrEqual(597);
      expect(remaining).toBeLessThanOrEqual(603);
    });

    it('debe retornar un valor <= 0 para tokens que ya expiraron', () => {
      const now = Math.floor(Date.now() / 1000);
      const tokenExpirado = createMockToken({
        id: '10',
        rol: 'Comercio',
        exp: now - 300, // expiró hace 5 minutos
      });

      const remaining = getTokenRemainingSeconds(tokenExpirado);
      expect(remaining).toBeLessThanOrEqual(0);
    });
  });

  describe('2. Evaluación de proximidad de expiración (isTokenExpiringSoon)', () => {
    it('debe retornar true si el token es nulo o expiró', () => {
      expect(isTokenExpiringSoon(null)).toBe(true);
      expect(isTokenExpiringSoon(undefined)).toBe(true);
      expect(isTokenExpiringSoon('')).toBe(true);
    });

    it('debe retornar true si el token vence dentro del umbral (por defecto 300s = 5 minutos)', () => {
      const now = Math.floor(Date.now() / 1000);
      const tokenPorVencer = createMockToken({
        id: '5',
        rol: 'Admin',
        exp: now + 180, // vence en 3 minutos (180s <= 300s)
      });

      expect(isTokenExpiringSoon(tokenPorVencer)).toBe(true);
    });

    it('debe retornar false si el token tiene más tiempo restante que el umbral', () => {
      const now = Math.floor(Date.now() / 1000);
      const tokenVigente = createMockToken({
        id: '5',
        rol: 'Admin',
        exp: now + 1200, // vence en 20 minutos (1200s > 300s)
      });

      expect(isTokenExpiringSoon(tokenVigente)).toBe(false);
    });

    it('debe respetar un umbral personalizado si se especifica', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = createMockToken({
        id: '5',
        rol: 'Admin',
        exp: now + 60, // vence en 1 minuto (60s)
      });

      // Con umbral de 30 segundos, aún no está "expirando pronto"
      expect(isTokenExpiringSoon(token, 30)).toBe(false);
      // Con umbral de 120 segundos, sí está "expirando pronto"
      expect(isTokenExpiringSoon(token, 120)).toBe(true);
    });
  });
});
