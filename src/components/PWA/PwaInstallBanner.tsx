import { useState } from "react";
import { usePwaInstall } from "../../hooks/usePwaInstall";

export const PwaInstallBanner = () => {
  const { canInstall, isIOS, hasNativePrompt, promptInstall, dismissPrompt } =
    usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!canInstall) return null;

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      setInstalling(true);
      try {
        await promptInstall();
      } finally {
        setInstalling(false);
      }
    } else if (isIOS) {
      setShowIosGuide(true);
    }
  };

  return (
    <div
      className="pwaInstallBanner"
      role="region"
      aria-label="Aviso de instalación de la aplicación"
    >
      <div className="pwaInstallBannerContent">
        {/* Logo de la aplicación */}
        <div className="pwaInstallBannerIconWrapper">
          <img
            src="/pwa-64x64.png"
            alt="Logo de ADLocal"
            className="pwaInstallBannerIcon"
            width={48}
            height={48}
          />
        </div>

        {/* Textos descriptivos */}
        <div className="pwaInstallBannerBody">
          <div className="pwaInstallBannerHeader">
            <h4 className="pwaInstallBannerTitle">Instala la App de ADLocal</h4>
            <span className="pwaInstallBannerBadge">Gratis</span>
          </div>
          <p className="pwaInstallBannerSubtitle">
            Acceso instantáneo a comercios, pedidos y citas desde tu pantalla de
            inicio, incluso sin conexión.
          </p>
        </div>

        {/* Acciones */}
        <div className="pwaInstallBannerActions">
          {hasNativePrompt && (
            <button
              type="button"
              className="btn-adlocal btn-adlocal--solid pwaInstallBtn"
              onClick={handleInstallClick}
              disabled={installing}
            >
              <span className="material-symbols-outlined fz-icon">
                download
              </span>
              {installing ? "Instalando..." : "Instalar App"}
            </button>
          )}

          {isIOS && !hasNativePrompt && (
            <button
              type="button"
              className="btn-adlocal btn-adlocal--solid pwaInstallBtn"
              onClick={() => setShowIosGuide((prev) => !prev)}
            >
              <span className="material-symbols-outlined fz-icon">
                ios_share
              </span>
              {showIosGuide ? "Ocultar guía" : "Cómo instalar"}
            </button>
          )}

          <button
            type="button"
            className="pwaInstallDismissBtn"
            onClick={dismissPrompt}
            aria-label="Cerrar aviso de instalación"
            title="Cerrar aviso"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Guía visual paso a paso para usuarios de iPhone / iPad en Safari */}
      {isIOS && showIosGuide && (
        <div className="pwaIosGuideContainer">
          <div className="pwaIosGuideHeader">
            <span className="material-symbols-outlined pwaIosGuideInfoIcon">
              info
            </span>
            <span className="fw-semibold">
              Instala ADLocal en tu iPhone o iPad:
            </span>
          </div>
          <ol className="pwaIosGuideSteps">
            <li>
              En la barra inferior de <strong>Safari</strong>, toca el botón{" "}
              <strong>Compartir</strong>{" "}
              <span className="pwaIosInlineIcon material-symbols-outlined">
                ios_share
              </span>
              .
            </li>
            <li>
              Desplázate hacia abajo y selecciona{" "}
              <strong>
                "Agregar a pantalla de inicio"{" "}
                <span className="pwaIosInlineIcon material-symbols-outlined">
                  add_box
                </span>
              </strong>
              .
            </li>
            <li>
              Toca <strong>"Agregar"</strong> en la esquina superior derecha.
              ¡Listo!
            </li>
          </ol>
          <div className="pwaIosGuideFooter">
            <button
              type="button"
              className="btn-adlocal btn-adlocal--ghost pwaIosCloseGuideBtn"
              onClick={() => setShowIosGuide(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

