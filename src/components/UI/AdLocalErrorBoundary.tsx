import { Component, type ErrorInfo, type ReactNode } from "react";
import MaterialSymbol from "./MaterialSymbol/MaterialSymbol";

interface Props {
  children: ReactNode;
  sectionName?: string;
  fullScreen?: boolean;
  onReset?: () => void;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AdLocalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[AdLocalErrorBoundary] Error capturado en renderizado:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(
          this.state.error ?? new Error("Error inesperado"),
          this.handleReset
        );
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { sectionName = "esta sección", fullScreen = false } = this.props;
      const errorMessage = this.state.error?.message || "Error desconocido";

      return (
        <div
          className={`d-flex flex-column align-items-center justify-content-center p-4 ${
            fullScreen ? "vh-100 vw-100" : "py-5 my-3"
          }`}
          style={{
            minHeight: fullScreen ? "100vh" : "360px",
            backgroundColor: fullScreen ? "#F8F6F2" : "transparent",
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            className="card-adlocal p-4 p-md-5 text-center d-flex flex-column align-items-center"
            style={{ maxWidth: "560px", width: "100%" }}
          >
            {/* Ícono de Alerta con Terracota Rojizo ADLocal */}
            <div
              className="d-flex align-items-center justify-content-center mb-3 rounded-circle"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "rgba(216, 64, 40, 0.12)",
                color: "#D84028",
              }}
            >
              <MaterialSymbol icon="warning" size="large" filled />
            </div>

            {/* Título y Mensaje */}
            <h2 className="fz-h2 fw-bold text-dark mb-2">
              Algo no salió como esperábamos
            </h2>
            <p className="fz-body text-secondary mb-4">
              Ocurrió un inconveniente inesperado al cargar {sectionName}. No te preocupes, tus datos no se han perdido.
            </p>

            {/* Botones de Acción */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-3 w-100">
              <button
                type="button"
                className="btn-adlocal btn-adlocal--solid flex-grow-1"
                style={{ maxWidth: "200px" }}
                onClick={this.handleReset}
              >
                <MaterialSymbol icon="refresh" size="small" />
                <span className="ms-1">Reintentar</span>
              </button>

              <button
                type="button"
                className="btn-adlocal btn-adlocal--secondary flex-grow-1"
                style={{ maxWidth: "200px" }}
                onClick={this.handleReload}
              >
                <MaterialSymbol icon="cached" size="small" />
                <span className="ms-1">Recargar página</span>
              </button>

              <button
                type="button"
                className="btn-adlocal btn-adlocal--ghost flex-grow-1"
                style={{ maxWidth: "200px" }}
                onClick={this.handleGoHome}
              >
                <MaterialSymbol icon="home" size="small" />
                <span className="ms-1">Ir al inicio</span>
              </button>
            </div>

            {/* Detalles Técnicos Opcionales */}
            <details className="mt-3 text-start w-100">
              <summary
                className="fz-caption text-muted"
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Ver detalles técnicos del error
              </summary>
              <div
                className="p-3 rounded mt-2 fz-caption"
                style={{
                  backgroundColor: "#F3EFE8",
                  color: "#1C1D1F",
                  maxHeight: "180px",
                  overflowY: "auto",
                  fontFamily: "monospace",
                }}
              >
                <strong style={{ color: "#D84028" }}>{errorMessage}</strong>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mb-0 mt-2 text-secondary" style={{ whiteSpace: "pre-wrap" }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdLocalErrorBoundary;
