import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Sistema de Diseño AdLocal - Validación de Tokens y Arquitectura CSS (AdLocal Panel)', () => {
  const stylesDir = path.resolve(process.cwd(), 'src/styles');

  const requiredModules = [
    'tokens.css',
    'typography.css',
    'bootstrap-overrides.css',
    'buttons.css',
    'cards.css',
    'tabs.css',
    'forms.css',
    'badges.css',
    'tables.css',
    'modals.css',
    'utilities.css',
    'index.css',
  ];

  describe('1. Presencia de los 11 módulos CSS requeridos e index.css', () => {
    it.each(requiredModules)('debe existir el módulo %s', (moduleName) => {
      const filePath = path.join(stylesDir, moduleName);
      expect(fs.existsSync(filePath), `Falta el archivo: ${moduleName}`).toBe(true);
    });
  });

  describe('2. Validación de variables en tokens.css', () => {
    const tokensContent = fs.readFileSync(path.join(stylesDir, 'tokens.css'), 'utf-8');

    const expectedTokens = [
      '--primary',
      '--primary-dark',
      '--primary-light',
      '--secondary',
      '--success',
      '--warning',
      '--error',
      '--info',
      '--bg',
      '--surface',
      '--text',
      '--border',
      '--font-body',
      '--space-1',
      '--space-4',
      '--radius-sm',
      '--radius-md',
      '--radius-full',
      '--shadow-sm',
      '--shadow-md',
      '--breakpoint-xs',
      '--breakpoint-md',
      '--breakpoint-lg',
    ];

    it.each(expectedTokens)('tokens.css debe definir %s', (token) => {
      expect(tokensContent.includes(`${token}:`), `Token faltante: ${token}`).toBe(true);
    });
  });

  describe('3. Validación de clases obligatorias en los módulos correspondientes', () => {
    const typographyCss = fs.readFileSync(path.join(stylesDir, 'typography.css'), 'utf-8');
    const buttonsCss = fs.readFileSync(path.join(stylesDir, 'buttons.css'), 'utf-8');
    const cardsCss = fs.readFileSync(path.join(stylesDir, 'cards.css'), 'utf-8');
    const tabsCss = fs.readFileSync(path.join(stylesDir, 'tabs.css'), 'utf-8');
    const badgesCss = fs.readFileSync(path.join(stylesDir, 'badges.css'), 'utf-8');
    const tablesCss = fs.readFileSync(path.join(stylesDir, 'tables.css'), 'utf-8');
    const modalsCss = fs.readFileSync(path.join(stylesDir, 'modals.css'), 'utf-8');
    const utilitiesCss = fs.readFileSync(path.join(stylesDir, 'utilities.css'), 'utf-8');

    it('typography.css debe definir escala fz-h1 a fz-h6, fz-body* y fw-*', () => {
      ['.fz-h1', '.fz-h2', '.fz-h3', '.fz-h4', '.fz-h5', '.fz-h6'].forEach((h) => {
        expect(typographyCss.includes(h), `Falta clase: ${h}`).toBe(true);
      });
      ['.fz-body', '.fz-body-sm', '.fz-caption'].forEach((b) => {
        expect(typographyCss.includes(b), `Falta clase: ${b}`).toBe(true);
      });
      ['.fw-regular', '.fw-medium', '.fw-semibold', '.fw-bold'].forEach((w) => {
        expect(typographyCss.includes(w), `Falta clase: ${w}`).toBe(true);
      });
    });

    it('buttons.css debe definir .btn-adlocal y variantes', () => {
      ['.btn-adlocal', '.btn-adlocal-primary', '.btn-adlocal-secondary', '.btn-adlocal-outline'].forEach((btn) => {
        expect(buttonsCss.includes(btn), `Falta clase: ${btn}`).toBe(true);
      });
    });

    it('cards.css debe definir .card-adlocal y sus secciones', () => {
      ['.card-adlocal', '.card-adlocal-header', '.card-adlocal-body', '.card-adlocal-footer'].forEach((c) => {
        expect(cardsCss.includes(c), `Falta clase: ${c}`).toBe(true);
      });
    });

    it('tabs.css debe definir .tabs-adlocal y .tab-adlocal con estados', () => {
      expect(tabsCss.includes('.tabs-adlocal')).toBe(true);
      expect(tabsCss.includes('.tab-adlocal')).toBe(true);
      expect(tabsCss.includes('.active')).toBe(true);
    });

    it('badges.css debe definir .badge-adlocal y .alert-adlocal', () => {
      expect(badgesCss.includes('.badge-adlocal')).toBe(true);
      expect(badgesCss.includes('.alert-adlocal')).toBe(true);
    });

    it('tables.css debe definir .table-adlocal', () => {
      expect(tablesCss.includes('.table-adlocal')).toBe(true);
    });

    it('modals.css debe definir .modal-adlocal', () => {
      expect(modalsCss.includes('.modal-adlocal')).toBe(true);
    });

    it('utilities.css debe definir .empty-state-adlocal y .skeleton-adlocal', () => {
      expect(utilitiesCss.includes('.empty-state-adlocal')).toBe(true);
      expect(utilitiesCss.includes('.skeleton-adlocal')).toBe(true);
    });
  });

  describe('4. Ensamblado en index.css', () => {
    it('index.css debe importar los 11 módulos', () => {
      const indexCss = fs.readFileSync(path.join(stylesDir, 'index.css'), 'utf-8');
      const expectedImports = [
        './tokens.css',
        './typography.css',
        './bootstrap-overrides.css',
        './buttons.css',
        './cards.css',
        './tabs.css',
        './forms.css',
        './badges.css',
        './tables.css',
        './modals.css',
        './utilities.css',
      ];
      expectedImports.forEach((imp) => {
        expect(indexCss.includes(imp), `index.css debe importar ${imp}`).toBe(true);
      });
    });
  });
});
