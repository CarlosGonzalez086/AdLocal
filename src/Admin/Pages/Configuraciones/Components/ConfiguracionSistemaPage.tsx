import { useState } from "react";
import { ClavesConfigForm } from "./ClavesConfigForm";
import { EmailConfigForm } from "./EmailConfigForm";
import { MarketplaceCommissionConfigForm } from "./MarketplaceCommissionConfigForm";
import { StripeConfigForm } from "./StripeConfigForm";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

type TabCategoria = "all" | "pagos" | "servicios";

export const ConfiguracionSistemaPage = () => {
  const [activeTab, setActiveTab] = useState<TabCategoria>("all");

  return (
    <div className="w-100 pb-4">
      {/* ENCABEZADO CORPORATIVO DEL MÓDULO */}
      <div className="card-adlocal p-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <div
                className="config-icon-badge config-icon-badge--teal"
                style={{ width: 38, height: 38 }}
              >
                <MaterialSymbol icon="tune" size="small" filled />
              </div>
              <h1
                className="fz-h2 fw-bold mb-0"
                style={{ color: "#1C1C1E", letterSpacing: "-0.5px" }}
              >
                Configuración del Sistema
              </h1>
            </div>
            <p
              className="fz-body text-secondary mb-0 ms-1"
              style={{ color: "#6E6E73", maxWidth: "780px" }}
            >
              Administra los parámetros centrales de la plataforma: comisiones
              comerciales por pedido, credenciales de pasarela Stripe, llaves
              de API externas y servidor de correo transaccional.
            </p>
          </div>

          {/* INDICADORES RÁPIDOS DE ESTATUS */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="badge-adlocal badge-adlocal--primary">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#008989",
                  display: "inline-block",
                }}
              />
              Sistema Activo
            </span>
            <span className="badge-adlocal badge-adlocal--secondary">
              <MaterialSymbol icon="lock" size="small" />
              Credenciales Seguras
            </span>
          </div>
        </div>

        {/* SELECTOR DE CATEGORÍAS / PESTAÑAS */}
        <div className="d-flex flex-wrap align-items-center gap-2 mt-4 pt-3 border-top">
          <button
            type="button"
            className={`config-nav-pill ${
              activeTab === "all" ? "config-nav-pill--active" : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            <MaterialSymbol icon="dashboard" size="small" />
            <span>Todas las configuraciones</span>
          </button>

          <button
            type="button"
            className={`config-nav-pill ${
              activeTab === "pagos" ? "config-nav-pill--active" : ""
            }`}
            onClick={() => setActiveTab("pagos")}
          >
            <MaterialSymbol icon="payments" size="small" />
            <span>Comisiones y Pagos</span>
          </button>

          <button
            type="button"
            className={`config-nav-pill ${
              activeTab === "servicios" ? "config-nav-pill--active" : ""
            }`}
            onClick={() => setActiveTab("servicios")}
          >
            <MaterialSymbol icon="cloud_sync" size="small" />
            <span>Servicios e Integraciones</span>
          </button>
        </div>
      </div>

      {/* DISTRIBUCIÓN RESPONSIVA DE FORMULARIOS */}
      {activeTab === "all" && (
        <div className="row g-4">
          {/* COLUMNA 1: FINANZAS Y PAGOS */}
          <div className="col-12 col-xl-6 d-flex flex-column gap-4">
            <MarketplaceCommissionConfigForm />
            <StripeConfigForm />
          </div>

          {/* COLUMNA 2: SERVICIOS Y COMUNICACIÓN */}
          <div className="col-12 col-xl-6 d-flex flex-column gap-4">
            <EmailConfigForm />
            <ClavesConfigForm />
          </div>
        </div>
      )}

      {activeTab === "pagos" && (
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <MarketplaceCommissionConfigForm />
          </div>
          <div className="col-12 col-lg-6">
            <StripeConfigForm />
          </div>
        </div>
      )}

      {activeTab === "servicios" && (
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <EmailConfigForm />
          </div>
          <div className="col-12 col-lg-6">
            <ClavesConfigForm />
          </div>
        </div>
      )}
    </div>
  );
};
